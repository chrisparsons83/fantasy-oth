/*
  Warnings:

  - A unique constraint covering the columns `[fleaflickerTeamId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_fleaflickerTeamId_key" ON "Team"("fleaflickerTeamId");
