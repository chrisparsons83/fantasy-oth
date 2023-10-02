/*
  Warnings:

  - A unique constraint covering the columns `[fleaflickerLeagueId]` on the table `League` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fleaflickerLeagueId` to the `League` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "League" ADD COLUMN     "fleaflickerLeagueId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "League_fleaflickerLeagueId_key" ON "League"("fleaflickerLeagueId");
