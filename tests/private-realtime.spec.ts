import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { jwtVerify, SignJWT } from 'jose';

import { PrismaParticipantService } from '@/shared/api/services/prisma/prisma-participant-service';
import { PrismaRoomService } from '@/shared/api/services/prisma/prisma-room-service';
import { getPrisma } from '@/shared/database/prisma';
import { RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { routes } from '@/shared/routes/routes';

config({ path: '.env.local', override: true, quiet: true });

async function fixture() {
  const db = getPrisma();
  const users = await Promise.all(
    ['Owner', 'Member', 'Outsider'].map(async (name) => {
      const sessionToken = randomUUID();
      const user = await db.user.create({
        data: {
          name: `${name} ${randomUUID()}`,
          sessions: {
            create: { sessionToken, expires: new Date(Date.now() + 3_600_000) },
          },
        },
      });
      return { ...user, sessionToken };
    }),
  );
  const [owner, member, outsider] = users;
  const service = new PrismaRoomService();
  const room = await service.create({
    name: `private-${randomUUID()}`,
    authorId: owner.id,
  });
  const otherRoom = await service.create({
    name: `other-${randomUUID()}`,
    authorId: owner.id,
  });
  const participants = new PrismaParticipantService();
  const participant = await participants.joinAuthenticated(room.id, member.id);
  return {
    owner,
    member,
    outsider,
    room,
    otherRoom,
    participant,
    participants,
    async cleanup() {
      await db.room.deleteMany({
        where: { id: { in: [room.id, otherRoom.id] } },
      });
      await db.user.deleteMany({
        where: { id: { in: users.map(({ id }) => id) } },
      });
    },
  };
}

test('private broadcasts enforce room scope, deny browser writes and expire removed members', async ({
  request,
}) => {
  test.setTimeout(110_000);
  const data = await fixture();
  const clients: SupabaseClient[] = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const signingKey = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!);
  const topic = RealtimeTopics.roomEvents(data.room.id);
  const credentials = async (sessionToken: string) => {
    const response = await request.get(
      routes.api.roomRealtimeToken.getPath(data.room.id),
      {
        headers: { Cookie: `next-auth.session-token=${sessionToken}` },
      },
    );
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toContain('no-store');
    return (await response.json()) as { token: string; expiresAt: number };
  };
  const connect = async (
    token: string | undefined,
    channelTopic = topic,
    isPrivate = true,
  ) => {
    const client = createClient(url, anonKey, {
      accessToken: async () => token || null,
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    clients.push(client);
    if (token) await client.realtime.setAuth(token);
    const received: string[] = [];
    const errors: string[] = [];
    const statuses: string[] = [];
    const channel = client.channel(channelTopic, {
      config: { private: isPrivate, broadcast: { ack: true, self: true } },
    });
    channel.on('broadcast', { event: 'SECURITY_PROBE' }, ({ payload }) =>
      received.push(payload.id),
    );
    const status = await new Promise<string>((resolve) => {
      channel.subscribe((state, error) => {
        statuses.push(state);
        if (error) errors.push(error.message);
        resolve(state);
      });
    });
    return { client, channel, status, statuses, received, errors };
  };
  const publish = async (id: string, broadcastTopic = topic) => {
    const response = await fetch(`${url}/realtime/v1/api/broadcast`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            topic: broadcastTopic,
            event: 'SECURITY_PROBE',
            payload: { id },
            private: true,
          },
        ],
      }),
    });
    expect(response.ok).toBe(true);
  };

  try {
    const noSession = await request.get(
      routes.api.roomRealtimeToken.getPath(data.room.id),
    );
    expect(noSession.status()).toBe(403);
    const outsider = await request.get(
      routes.api.roomRealtimeToken.getPath(data.room.id),
      {
        headers: {
          Cookie: `next-auth.session-token=${data.outsider.sessionToken}`,
        },
      },
    );
    expect(outsider.status()).toBe(403);

    const memberToken = await credentials(data.member.sessionToken);
    const { payload, protectedHeader } = await jwtVerify(
      memberToken.token,
      signingKey,
      { issuer: 'planning-poker', audience: 'authenticated' },
    );
    expect(protectedHeader.alg).toBe('HS256');
    expect(payload).toMatchObject({
      sub: data.member.id,
      role: 'authenticated',
      room_id: data.room.id,
      participant_id: data.participant.id,
    });
    expect(payload.exp! - payload.iat!).toBe(60);
    expect(memberToken.expiresAt).toBe(payload.exp);

    const member = await connect(memberToken.token);
    expect(member.status, member.errors.join('; ')).toBe('SUBSCRIBED');
    const notifications = await connect(
      memberToken.token,
      RealtimeTopics.roomNotifications(data.room.id),
    );
    expect(notifications.status).toBe('SUBSCRIBED');
    expect((await connect(undefined)).status).toBe('CHANNEL_ERROR');
    expect(
      (
        await connect(
          memberToken.token,
          RealtimeTopics.roomEvents(data.otherRoom.id),
        )
      ).status,
    ).toBe('CHANNEL_ERROR');
    const expired = await new SignJWT({
      ...payload,
      exp: Math.floor(Date.now() / 1000) - 10,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(signingKey);
    expect((await connect(expired)).status).toBe('CHANNEL_ERROR');
    const forged = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(
        new TextEncoder().encode('untrusted-secret-that-is-at-least-32-bytes'),
      );
    expect((await connect(forged)).status).toBe('CHANNEL_ERROR');
    const mismatchedIdentity = await new SignJWT({
      ...payload,
      sub: data.outsider.id,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(signingKey);
    expect((await connect(mismatchedIdentity)).status).toBe('CHANNEL_ERROR');

    // The public version of the same topic must never receive private app messages.
    const publicChannel = await connect(undefined, topic, false);
    expect(publicChannel.status).toBe('SUBSCRIBED');
    const first = randomUUID();
    await publish(first);
    await expect.poll(() => member.received).toContain(first);
    expect(publicChannel.received).toEqual([]);
    const notice = randomUUID();
    await publish(notice, RealtimeTopics.roomNotifications(data.room.id));
    await expect.poll(() => notifications.received).toContain(notice);

    const spoof = randomUUID();
    await member.channel.send({
      type: 'broadcast',
      event: 'SECURITY_PROBE',
      payload: { id: spoof },
    });
    const afterSpoof = randomUUID();
    await publish(afterSpoof);
    await expect.poll(() => member.received).toContain(afterSpoof);
    expect(member.received).not.toContain(spoof);

    // Neither the public key nor the scoped JWT can read application/session data.
    for (const token of [anonKey, memberToken.token]) {
      for (const table of [
        'users',
        'accounts',
        'sessions',
        'verification_requests',
        'rooms',
        'games',
        'participants',
        'room_invitations',
        'votes',
        '_prisma_migrations',
      ]) {
        const response = await fetch(
          `${url}/rest/v1/${table}?select=*&limit=1`,
          { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } },
        );
        expect([401, 403]).toContain(response.status);
      }
    }

    expect(member.statuses).toEqual(['SUBSCRIBED']);
    expect(
      await data.participants.leave(data.room.id, data.participant.id),
    ).toBe(true);
    const renewal = await request.get(
      routes.api.roomRealtimeToken.getPath(data.room.id),
      {
        headers: {
          Cookie: `next-auth.session-token=${data.member.sessionToken}`,
        },
      },
    );
    expect(renewal.status()).toBe(403);
    expect((await connect(memberToken.token)).status).toBe('CHANNEL_ERROR');

    // A hostile client ignores removal and does not refresh. Supabase must close it at expiry.
    await expect
      .poll(
        () =>
          member.statuses.some(
            (state) => state === 'CLOSED' || state === 'CHANNEL_ERROR',
          ),
        {
          timeout: 70_000,
          intervals: [500],
        },
      )
      .toBe(true);
    expect(Date.now()).toBeGreaterThanOrEqual(memberToken.expiresAt * 1000);
    expect(Date.now()).toBeLessThan((memberToken.expiresAt + 10) * 1000);
    const finalOwner = await connect(
      (await credentials(data.owner.sessionToken)).token,
    );
    expect(finalOwner.status).toBe('SUBSCRIBED');
    const afterRemoval = randomUUID();
    await publish(afterRemoval);
    await expect.poll(() => finalOwner.received).toContain(afterRemoval);
    expect(member.received).not.toContain(afterRemoval);
    expect(publicChannel.received).toEqual([]);
  } finally {
    await Promise.all(
      clients.map(async (client) => {
        await client.removeAllChannels();
        client.realtime.disconnect();
      }),
    );
    await data.cleanup();
  }
});

test('room tokens refresh and reconnecting restores missed state without exposing hidden votes', async ({
  browser,
}) => {
  test.setTimeout(70_000);
  const data = await fixture();
  const context = await browser.newContext({
    baseURL: 'http://localhost:3000',
  });
  try {
    await context.addCookies([
      {
        name: 'next-auth.session-token',
        value: data.member.sessionToken,
        domain: 'localhost',
        path: '/',
      },
    ]);
    const page = await context.newPage();
    await page.addInitScript(() => {
      const OriginalWebSocket = window.WebSocket;
      window.WebSocket = class extends OriginalWebSocket {
        constructor(url: string | URL, protocols?: string | string[]) {
          super(url, protocols);
          if (String(url).includes('/realtime/v1/')) {
            window.addEventListener('test-disconnect-realtime', () =>
              this.close(),
            );
          }
        }
      };
    });
    const stateResponses: string[] = [];
    page.on('response', async (response) => {
      if (response.request().headers()['next-action']) {
        const body = await response.text().catch(() => '');
        if (body.includes('votedParticipantIds')) stateResponses.push(body);
      }
    });
    let tokenRequests = 0;
    page.on('response', (response) => {
      if (
        response.url().endsWith('/realtime-token') &&
        response.status() === 200
      )
        tokenRequests += 1;
    });
    await page.goto(`/en/game/${data.room.id}`);
    await expect(page.getByTestId('create-game-trigger-button')).toBeVisible();
    await expect
      .poll(() => tokenRequests, { timeout: 40_000 })
      .toBeGreaterThanOrEqual(2);
    await expect(page.getByTestId('create-game-trigger-button')).toBeVisible();

    // Drop the real socket while offline, then verify automatic reconnection and state recovery.
    await context.setOffline(true);
    await page.evaluate(() =>
      window.dispatchEvent(new Event('test-disconnect-realtime')),
    );
    await expect(page.getByRole('status')).toContainText(
      'Connecting to the room',
    );
    const db = getPrisma();
    const game = await db.game.create({
      data: { roomId: data.room.id, name: 'While disconnected' },
    });
    const ownerParticipant = await db.participant.findUniqueOrThrow({
      where: { roomId_userId: { roomId: data.room.id, userId: data.owner.id } },
    });
    await db.vote.create({
      data: { gameId: game.id, participantId: ownerParticipant.id, vote: '13' },
    });
    await context.setOffline(false);
    // The new subscription must resynchronize even though this round was never broadcast.
    await expect(
      page.getByText('While disconnected', { exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId('reveal-cards-button')).toBeVisible();
    await expect(page.getByTestId('voting-avg')).toHaveCount(0);
    expect(stateResponses.at(-1)).toContain('votedParticipantIds');
    expect(stateResponses.at(-1)).not.toContain('"vote":"13"');

    await data.participants.leave(data.room.id, data.participant.id);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await expect(page).toHaveURL('/en/game/join');
    const channels = page.getByTestId('voting-card-3');
    await expect(channels).toHaveCount(0);
  } finally {
    await context.close();
    await data.cleanup();
  }
});
