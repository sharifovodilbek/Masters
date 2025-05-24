-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACTIVE', 'FINISHED');

-- AlterTable
ALTER TABLE "OrderMasters" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
