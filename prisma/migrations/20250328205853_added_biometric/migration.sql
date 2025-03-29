/*
  Warnings:

  - A unique constraint covering the columns `[biometric_key]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `biometric_key` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biometric_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_biometric_key_key" ON "User"("biometric_key");
