/*
  Warnings:

  - Added the required column `losses` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerName` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointsFor` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamName` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ties` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wins` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "losses" INTEGER NOT NULL,
ADD COLUMN     "ownerName" TEXT NOT NULL,
ADD COLUMN     "pointsFor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "teamName" TEXT NOT NULL,
ADD COLUMN     "ties" INTEGER NOT NULL,
ADD COLUMN     "wins" INTEGER NOT NULL;
