-- AlterTable
ALTER TABLE "public"."_RoomParticipants" ADD CONSTRAINT "_RoomParticipants_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "public"."_RoomParticipants_AB_unique";

-- AlterTable
ALTER TABLE "public"."games" ADD COLUMN     "issueKey" TEXT;
