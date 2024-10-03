-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('started', 'finished');

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'started';
