-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL,
    "leagueName" TEXT NOT NULL,
    "divisionLevel" INTEGER NOT NULL,
    "seasonId" TEXT NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isOpenForRegistration" BOOLEAN NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
