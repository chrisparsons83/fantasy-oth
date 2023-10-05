/*
  Warnings:

  - You are about to drop the column `discordUserId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_discordUserId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordUserId";
