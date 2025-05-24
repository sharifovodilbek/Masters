/*
  Warnings:

  - You are about to drop the column `UserType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "UserType";

-- CreateTable
CREATE TABLE "USER_YUR" (
    "id" SERIAL NOT NULL,
    "INN" TEXT NOT NULL,
    "R_S" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Bank" TEXT NOT NULL,
    "MFO" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "USER_YUR_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_YUR_userId_key" ON "USER_YUR"("userId");

-- AddForeignKey
ALTER TABLE "USER_YUR" ADD CONSTRAINT "USER_YUR_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
