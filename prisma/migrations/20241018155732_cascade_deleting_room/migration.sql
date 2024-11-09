-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_roomId_fkey";

-- DropForeignKey
ALTER TABLE "room_users" DROP CONSTRAINT "room_users_roomId_fkey";

-- AddForeignKey
ALTER TABLE "room_users" ADD CONSTRAINT "room_users_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
