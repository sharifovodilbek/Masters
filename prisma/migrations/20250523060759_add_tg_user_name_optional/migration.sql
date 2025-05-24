/*
  Warnings:

  - A unique constraint covering the columns `[tgUserName]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "tgChatId" TEXT,
ADD COLUMN     "tgUserName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Contact_tgUserName_key" ON "Contact"("tgUserName");
