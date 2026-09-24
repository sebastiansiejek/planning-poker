import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from '@playwright/test';
import { Client } from 'pg';

test('participant migration preserves owners, legacy members, and votes', async () => {
  const client = new Client({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  });
  const schema = `migration_test_${randomUUID().replaceAll('-', '')}`;
  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET LOCAL search_path TO "${schema}"`);
    await client.query(`
      CREATE TABLE users (id text PRIMARY KEY, name text NOT NULL, image text);
      CREATE TABLE rooms (id text PRIMARY KEY, "authorId" text NOT NULL, "createdAt" timestamp NOT NULL, "updatedAt" timestamp NOT NULL);
      CREATE TABLE games (id text PRIMARY KEY, "roomId" text NOT NULL);
      CREATE TABLE room_users (id text PRIMARY KEY, "roomId" text NOT NULL, "userId" text NOT NULL, "createdAt" timestamp NOT NULL, "updatedAt" timestamp NOT NULL);
      CREATE TABLE user_votes (id text PRIMARY KEY, "userId" text NOT NULL, "gameId" text NOT NULL, vote text NOT NULL, "createdAt" timestamp NOT NULL, "updatedAt" timestamp NOT NULL);
      CREATE TABLE "_RoomParticipants" ("A" text NOT NULL, "B" text NOT NULL);
      INSERT INTO users (id, name) VALUES ('owner', 'Owner'), ('member', 'Member'), ('implicit', 'Implicit'), ('voter', 'Voter');
      INSERT INTO rooms (id, "authorId", "createdAt", "updatedAt") VALUES ('room', 'owner', now(), now());
      INSERT INTO games (id, "roomId") VALUES ('round', 'room');
      INSERT INTO room_users (id, "roomId", "userId", "createdAt", "updatedAt") VALUES ('legacy-member', 'room', 'member', now(), now());
      INSERT INTO "_RoomParticipants" ("A", "B") VALUES ('room', 'implicit');
      INSERT INTO user_votes (id, "userId", "gameId", vote, "createdAt", "updatedAt") VALUES ('legacy-vote', 'voter', 'round', '5', now(), now());
    `);

    const migration = readFileSync(
      join(process.cwd(), 'prisma/migrations/20260924120000_room_participants_and_votes/migration.sql'),
      'utf8',
    );
    await client.query(migration);

    const participants = await client.query<{ userId: string; id: string }>(
      'SELECT "userId", id FROM participants ORDER BY "userId"',
    );
    expect(participants.rows).toHaveLength(4);
    expect(participants.rows.find((row) => row.userId === 'member')?.id).toBe('legacy-member');

    const votes = await client.query<{ userId: string; vote: string }>(`
      SELECT p."userId", v.vote FROM votes v
      JOIN participants p ON p.id = v."participantId"
    `);
    expect(votes.rows).toEqual([{ userId: 'voter', vote: '5' }]);

    const cleanup = readFileSync(
      join(process.cwd(), 'prisma/migrations/20260924130000_remove_unused_legacy_memberships/migration.sql'),
      'utf8',
    );
    await expect(client.query(cleanup)).rejects.toThrow(
      'Legacy membership or vote tables contain rows',
    );
  } finally {
    await client.query('ROLLBACK');
    await client.end();
  }
});
