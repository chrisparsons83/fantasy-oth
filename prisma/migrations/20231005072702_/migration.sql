/*
  Warnings:

  - You are about to drop the column `discordUserId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_discordUserId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordUserId";

-- DropTable
DROP TABLE "users";
