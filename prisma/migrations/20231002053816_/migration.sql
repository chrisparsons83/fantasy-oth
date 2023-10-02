/*
  Warnings:

  - You are about to drop the column `losses` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `ties` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `Team` table. All the data in the column will be lost.
  - Added the required column `fleaflickerTeamId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "losses",
DROP COLUMN "ties",
DROP COLUMN "wins",
ADD COLUMN     "fleaflickerTeamId" INTEGER NOT NULL;
