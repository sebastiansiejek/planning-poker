-- Preserve member and vote history while moving room identity from User to Participant.
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "guestTokenHash" TEXT,
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "participants_guestTokenHash_key" ON "participants"("guestTokenHash");
CREATE UNIQUE INDEX "participants_roomId_userId_key" ON "participants"("roomId", "userId");
CREATE INDEX "participants_roomId_leftAt_idx" ON "participants"("roomId", "leftAt");

CREATE TABLE "room_invitations" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "room_invitations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "room_invitations_tokenHash_key" ON "room_invitations"("tokenHash");
CREATE INDEX "room_invitations_roomId_revokedAt_idx" ON "room_invitations"("roomId", "revokedAt");

CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "votes_participantId_gameId_key" ON "votes"("participantId", "gameId");

-- Use existing room_users IDs so membership has a stable migration path.
INSERT INTO "participants" ("id", "roomId", "userId", "name", "image", "createdAt", "updatedAt")
SELECT ru."id", ru."roomId", ru."userId", u."name", u."image", ru."createdAt", ru."updatedAt"
FROM "room_users" ru
JOIN "users" u ON u."id" = ru."userId";

-- A room owner or legacy implicit member may not have a room_users row.
INSERT INTO "participants" ("id", "roomId", "userId", "name", "image", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, r."id", r."authorId", u."name", u."image", r."createdAt", r."updatedAt"
FROM "rooms" r
JOIN "users" u ON u."id" = r."authorId"
ON CONFLICT ("roomId", "userId") DO NOTHING;

INSERT INTO "participants" ("id", "roomId", "userId", "name", "image", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, legacy."A", legacy."B", u."name", u."image", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "_RoomParticipants" legacy
JOIN "users" u ON u."id" = legacy."B"
ON CONFLICT ("roomId", "userId") DO NOTHING;

-- Retain votes from users who were no longer listed as room members.
INSERT INTO "participants" ("id", "roomId", "userId", "name", "image", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, g."roomId", uv."userId", u."name", u."image", uv."createdAt", uv."updatedAt"
FROM "user_votes" uv
JOIN "games" g ON g."id" = uv."gameId"
JOIN "users" u ON u."id" = uv."userId"
ON CONFLICT ("roomId", "userId") DO NOTHING;

INSERT INTO "votes" ("id", "participantId", "gameId", "vote", "createdAt", "updatedAt")
SELECT uv."id", p."id", uv."gameId", uv."vote", uv."createdAt", uv."updatedAt"
FROM "user_votes" uv
JOIN "games" g ON g."id" = uv."gameId"
JOIN "participants" p ON p."roomId" = g."roomId" AND p."userId" = uv."userId";

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM "votes") <> (SELECT COUNT(*) FROM "user_votes") THEN
    RAISE EXCEPTION 'Vote backfill did not preserve every legacy vote';
  END IF;
END $$;

ALTER TABLE "participants" ADD CONSTRAINT "participants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "participants" ADD CONSTRAINT "participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "room_invitations" ADD CONSTRAINT "room_invitations_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "room_invitations" ADD CONSTRAINT "room_invitations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "votes" ADD CONSTRAINT "votes_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "votes" ADD CONSTRAINT "votes_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
