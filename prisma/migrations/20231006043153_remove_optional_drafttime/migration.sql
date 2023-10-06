/*
  Warnings:

  - Made the column `draftDateTime` on table `League` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "League" ALTER COLUMN "draftDateTime" SET NOT NULL;
