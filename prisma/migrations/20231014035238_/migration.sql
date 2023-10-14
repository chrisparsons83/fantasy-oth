/*
  Warnings:

  - Added the required column `fromScript` to the `ScoreUpdate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScoreUpdate" ADD COLUMN     "fromScript" BOOLEAN NOT NULL;
