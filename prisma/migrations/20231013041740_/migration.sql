-- CreateTable
CREATE TABLE "WeeklyScore" (
    "fleaflickerTeamId" TEXT NOT NULL,
    "gamePeriod" INTEGER NOT NULL,
    "pointsFor" DOUBLE PRECISION NOT NULL,
    "teamId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyScore_gamePeriod_fleaflickerTeamId_key" ON "WeeklyScore"("gamePeriod", "fleaflickerTeamId");

-- AddForeignKey
ALTER TABLE "WeeklyScore" ADD CONSTRAINT "WeeklyScore_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
