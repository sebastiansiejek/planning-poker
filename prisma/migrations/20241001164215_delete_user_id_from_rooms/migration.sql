/*
  Warnings:

  - You are about to drop the column `userId` on the `rooms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_userId_fkey";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "userId";
