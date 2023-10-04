/*
  Warnings:

  - A unique constraint covering the columns `[seasonId,userId]` on the table `FSquaredEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `FSquaredEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FSquaredEntry" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_FSquaredEntryToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FSquaredEntryToTeam_AB_unique" ON "_FSquaredEntryToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_FSquaredEntryToTeam_B_index" ON "_FSquaredEntryToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "FSquaredEntry_seasonId_userId_key" ON "FSquaredEntry"("seasonId", "userId");

-- AddForeignKey
ALTER TABLE "FSquaredEntry" ADD CONSTRAINT "FSquaredEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FSquaredEntryToTeam" ADD CONSTRAINT "_FSquaredEntryToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "FSquaredEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FSquaredEntryToTeam" ADD CONSTRAINT "_FSquaredEntryToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
