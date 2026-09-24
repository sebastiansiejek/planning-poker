-- The pre-release Prisma app had no production users. Keep this guard so a
-- deployment stops instead of discarding unexpected legacy membership or votes.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "_RoomParticipants")
    OR EXISTS (SELECT 1 FROM "room_users")
    OR EXISTS (SELECT 1 FROM "user_votes") THEN
    RAISE EXCEPTION 'Legacy membership or vote tables contain rows; inspect them before cleanup';
  END IF;
END $$;

ALTER TABLE "_RoomParticipants" DROP CONSTRAINT "_RoomParticipants_A_fkey";
ALTER TABLE "_RoomParticipants" DROP CONSTRAINT "_RoomParticipants_B_fkey";
ALTER TABLE "room_users" DROP CONSTRAINT "room_users_roomId_fkey";
ALTER TABLE "room_users" DROP CONSTRAINT "room_users_userId_fkey";
ALTER TABLE "user_votes" DROP CONSTRAINT "user_votes_gameId_fkey";
ALTER TABLE "user_votes" DROP CONSTRAINT "user_votes_userId_fkey";

DROP TABLE "_RoomParticipants";
DROP TABLE "room_users";
DROP TABLE "user_votes";
