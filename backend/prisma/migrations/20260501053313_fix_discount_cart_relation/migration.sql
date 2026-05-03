/*
  Warnings:

  - You are about to drop the column `discount_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `discount_id` on the `order_items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_discount_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "discount_id";

-- AlterTable
ALTER TABLE "discounts" ALTER COLUMN "max_discount_amount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "discount_id";
