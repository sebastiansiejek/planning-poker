/*
  Warnings:

  - A unique constraint covering the columns `[authorId,name]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rooms_authorId_name_key" ON "rooms"("authorId", "name");
