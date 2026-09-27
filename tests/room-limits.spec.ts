import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

import { PrismaGameService } from '@/shared/api/services/prisma/prisma-game-service';
import { PrismaParticipantService } from '@/shared/api/services/prisma/prisma-participant-service';
import { PrismaRoomService } from '@/shared/api/services/prisma/prisma-room-service';
import { PrismaVoteService } from '@/shared/api/services/prisma/prisma-vote-service';
import { getPrisma } from '@/shared/database/prisma';
import { routes } from '@/shared/routes/routes';

test('two concurrent rooms fill the owner quota, and owner deletion frees a slot', async () => {
  const prisma = getPrisma();
  const [owner, otherUser] = await Promise.all([
    prisma.user.create({ data: { id: randomUUID(), name: 'Owner' } }),
    prisma.user.create({ data: { id: randomUUID(), name: 'Other user' } }),
  ]);
  const rooms = new PrismaRoomService();
  try {
    const created = await Promise.all(
      ['First', 'Second'].map((name) => rooms.create({ name, authorId: owner.id })),
    );
    await expect(rooms.create({ name: 'Third', authorId: owner.id })).rejects.toThrow('Room limit reached');

    const member = await new PrismaParticipantService().joinAuthenticated(created[0].id, otherUser.id);
    const game = await new PrismaGameService().create({ roomId: created[0].id, actorUserId: owner.id });
    await new PrismaVoteService().upsert({
      gameId: game.id,
      roomId: created[0].id,
      participantId: member.id,
      vote: '5',
    });

    expect(await rooms.deleteOwned({ roomId: created[0].id, authorId: otherUser.id })).toBe(false);
    expect(await prisma.room.count({ where: { authorId: owner.id } })).toBe(2);
    expect(await rooms.deleteOwned({ roomId: created[0].id, authorId: owner.id })).toBe(true);
    expect(await prisma.game.findUnique({ where: { id: game.id } })).toBeNull();
    expect(await prisma.vote.count({ where: { gameId: game.id } })).toBe(0);
    expect(await prisma.participant.findUnique({ where: { id: member.id } })).toBeNull();

    const replacement = await rooms.create({ name: 'Replacement', authorId: owner.id });
    expect(replacement.authorId).toBe(owner.id);
    expect(await prisma.room.count({ where: { authorId: owner.id } })).toBe(2);
  } finally {
    await prisma.room.deleteMany({ where: { authorId: owner.id } });
    await prisma.user.deleteMany({ where: { id: { in: [owner.id, otherUser.id] } } });
  }
});

test('owner sees the two-room limit and can delete a room from the dashboard', async ({ page }) => {
  const prisma = getPrisma();
  const ownerId = randomUUID();
  const sessionToken = randomUUID();
  const firstName = `First ${randomUUID()}`;
  const secondName = `Second ${randomUUID()}`;
  const replacementName = `Replacement ${randomUUID()}`;
  const roomIds: string[] = [];

  const createRoom = async (name: string) => {
    await page.goto(routes.game.create.getPath());
    await page.getByTestId('game-name').click();
    await page.getByTestId('game-name').fill(name);
    await page.getByTestId('create-game-submit').click();
    await page.waitForURL((url) => /^\/en\/game\/(?!create$|join$)[^/]+$/.test(url.pathname));
    const id = new URL(page.url()).pathname.split('/').at(-1)!;
    roomIds.push(id);
    return id;
  };

  try {
    await prisma.user.create({
      data: {
        id: ownerId,
        name: 'Room owner',
        sessions: {
          create: { sessionToken, expires: new Date(Date.now() + 60 * 60 * 1000) },
        },
      },
    });
    await page.context().addCookies([
      { name: 'next-auth.session-token', value: sessionToken, domain: 'localhost', path: '/' },
    ]);

    const firstRoomId = await createRoom(firstName);
    await createRoom(secondName);

    await page.goto(routes.game.create.getPath());
    await page.getByTestId('game-name').click();
    await page.getByTestId('game-name').fill(replacementName);
    await page.getByTestId('create-game-submit').click();
    await expect(page.getByText('You can create up to two rooms. Delete one from your dashboard to create another.')).toBeVisible();
    await expect(page.getByTestId('join-to-game')).toHaveCount(0);

    const roomPage = await page.context().newPage();
    await roomPage.goto(routes.game.singleGame.getPath(firstRoomId));
    await expect(roomPage.getByRole('heading', { name: firstName })).toBeVisible();

    await page.goto(routes.dashboard.getPath());
    await page.getByRole('button', { name: `Delete room ${firstName}` }).click();
    await expect(page.getByRole('alertdialog')).toContainText('all rounds, and all votes');
    await page.getByRole('button', { name: 'Delete room', exact: true }).click();
    await expect(page.getByText(firstName, { exact: true })).toHaveCount(0);
    await expect(roomPage).toHaveURL('/en/dashboard');
    await expect(roomPage.getByText('The owner deleted this room. You have returned to the dashboard.', { exact: true })).toBeVisible();
    await roomPage.close();

    await createRoom(replacementName);
    expect(await prisma.room.count({ where: { id: { in: roomIds } } })).toBe(2);
  } finally {
    await prisma.room.deleteMany({ where: { id: { in: roomIds } } });
    await prisma.user.delete({ where: { id: ownerId } });
  }
});
