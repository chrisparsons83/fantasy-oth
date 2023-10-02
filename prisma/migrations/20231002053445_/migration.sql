/*
  Warnings:

  - You are about to drop the column `divisionLevel` on the `League` table. All the data in the column will be lost.
  - You are about to drop the column `leagueName` on the `League` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "League" DROP COLUMN "divisionLevel",
DROP COLUMN "leagueName";
