/*
  Warnings:

  - You are about to drop the column `userId` on the `Letter` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Letter" DROP CONSTRAINT "Letter_userId_fkey";

-- AlterTable
ALTER TABLE "Letter" DROP COLUMN "userId";
