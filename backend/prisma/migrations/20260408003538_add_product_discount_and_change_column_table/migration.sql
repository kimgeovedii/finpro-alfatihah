/*
  Warnings:

  - You are about to drop the column `product_id` on the `discounts` table. All the data in the column will be lost.
  - You are about to drop the column `branch_inventory_id` on the `mutation_journals` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_change` on the `mutation_journals` table. All the data in the column will be lost.
  - You are about to drop the column `stock_after` on the `mutation_journals` table. All the data in the column will be lost.
  - You are about to drop the column `stock_before` on the `mutation_journals` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `mutation_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `mutation_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `mutation_journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mutation_id` to the `stock_journals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MutationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'RECEIVED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "ReferenceType" ADD VALUE 'MUTATION';

-- DropForeignKey
ALTER TABLE "discounts" DROP CONSTRAINT "discounts_product_id_fkey";

-- DropForeignKey
ALTER TABLE "mutation_journals" DROP CONSTRAINT "mutation_journals_branch_inventory_id_fkey";

-- AlterTable
ALTER TABLE "discounts" DROP COLUMN "product_id";

-- AlterTable
ALTER TABLE "mutation_journals" DROP COLUMN "branch_inventory_id",
DROP COLUMN "quantity_change",
DROP COLUMN "stock_after",
DROP COLUMN "stock_before",
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "status" "MutationStatus" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "stock_journals" ADD COLUMN     "mutation_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "product_discounts" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "discount_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_discounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_mutation_id_fkey" FOREIGN KEY ("mutation_id") REFERENCES "mutation_journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_discounts" ADD CONSTRAINT "product_discounts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_discounts" ADD CONSTRAINT "product_discounts_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
