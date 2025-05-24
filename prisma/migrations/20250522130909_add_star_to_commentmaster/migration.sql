/*
  Warnings:

  - Added the required column `star` to the `CommentMasters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentMasters" ADD COLUMN     "star" INTEGER NOT NULL;
