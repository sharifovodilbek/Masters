/*
  Warnings:

  - You are about to drop the column `experience` on the `Master` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `Master` table. All the data in the column will be lost.
  - You are about to drop the column `minWorkingHours` on the `Master` table. All the data in the column will be lost.
  - You are about to drop the column `price_daily` on the `Master` table. All the data in the column will be lost.
  - You are about to drop the column `price_hourly` on the `Master` table. All the data in the column will be lost.
  - You are about to drop the column `star` on the `Master` table. All the data in the column will be lost.
  - You are about to drop the `Basket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommentToMaster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MasterToProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name_uz]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_ru]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_en]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `GeneralInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_uz]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_ru]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_en]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_uz]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_ru]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_en]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_uz]` on the table `Tool` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_ru]` on the table `Tool` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_en]` on the table `Tool` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Basket" DROP CONSTRAINT "Basket_productId_fkey";

-- DropForeignKey
ALTER TABLE "Basket" DROP CONSTRAINT "Basket_userId_fkey";

-- DropForeignKey
ALTER TABLE "Master" DROP CONSTRAINT "Master_levelId_fkey";

-- DropForeignKey
ALTER TABLE "_CommentToMaster" DROP CONSTRAINT "_CommentToMaster_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentToMaster" DROP CONSTRAINT "_CommentToMaster_B_fkey";

-- DropForeignKey
ALTER TABLE "_MasterToProduct" DROP CONSTRAINT "_MasterToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_MasterToProduct" DROP CONSTRAINT "_MasterToProduct_B_fkey";

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "Master" DROP COLUMN "experience",
DROP COLUMN "levelId",
DROP COLUMN "minWorkingHours",
DROP COLUMN "price_daily",
DROP COLUMN "price_hourly",
DROP COLUMN "star";

-- DropTable
DROP TABLE "Basket";

-- DropTable
DROP TABLE "_CommentToMaster";

-- DropTable
DROP TABLE "_MasterToProduct";

-- CreateTable
CREATE TABLE "Star" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "masterId" INTEGER NOT NULL,
    "star" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Star_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BasketItem" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BasketItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterProduct" (
    "id" SERIAL NOT NULL,
    "masterId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "minWorkingHours" INTEGER NOT NULL,
    "price_hourly" DOUBLE PRECISION NOT NULL,
    "price_daily" DOUBLE PRECISION NOT NULL,
    "experience" INTEGER NOT NULL,

    CONSTRAINT "MasterProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterProduct_masterId_productId_key" ON "MasterProduct"("masterId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_uz_key" ON "Brand"("name_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_ru_key" ON "Brand"("name_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_en_key" ON "Brand"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phone_key" ON "Contact"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralInfo_email_key" ON "GeneralInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Master_phone_key" ON "Master"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_uz_key" ON "Product"("name_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_ru_key" ON "Product"("name_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_en_key" ON "Product"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_uz_key" ON "Region"("name_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_ru_key" ON "Region"("name_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_en_key" ON "Region"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_name_uz_key" ON "Tool"("name_uz");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_name_ru_key" ON "Tool"("name_ru");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_name_en_key" ON "Tool"("name_en");

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Star" ADD CONSTRAINT "Star_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasketItem" ADD CONSTRAINT "BasketItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasketItem" ADD CONSTRAINT "BasketItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterProduct" ADD CONSTRAINT "MasterProduct_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterProduct" ADD CONSTRAINT "MasterProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterProduct" ADD CONSTRAINT "MasterProduct_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
