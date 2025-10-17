/*
  Warnings:

  - You are about to drop the column `issueAnylyze` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."games" DROP COLUMN "issueAnylyze",
ADD COLUMN     "issueAnalyze" JSONB;
