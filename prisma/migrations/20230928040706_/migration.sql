/*
  Warnings:

  - Added the required column `division` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `League` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "League" ADD COLUMN     "division" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
