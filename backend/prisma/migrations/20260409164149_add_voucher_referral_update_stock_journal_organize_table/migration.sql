/*
  Warnings:

  - The values [PRODUCT,SHIPPING,USER] on the enum `VoucherType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `product_category_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `discount_voucher_used` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by` to the `discounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VoucherType_new" AS ENUM ('ORDER', 'SHIPPING_COST');
ALTER TABLE "vouchers" ALTER COLUMN "type" TYPE "VoucherType_new" USING ("type"::text::"VoucherType_new");
ALTER TYPE "VoucherType" RENAME TO "VoucherType_old";
ALTER TYPE "VoucherType_new" RENAME TO "VoucherType";
DROP TYPE "public"."VoucherType_old" CASCADE;
COMMIT;

-- DropForeignKey
ALTER TABLE "discount_voucher_used" DROP CONSTRAINT "discount_voucher_used_reference_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_product_category_id_fkey";

-- AlterTable
ALTER TABLE "discounts" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "product_category_id",
ADD COLUMN     "category_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stock_journals" ALTER COLUMN "mutation_id" DROP NOT NULL;

-- DropTable
DROP TABLE "discount_voucher_used";

-- CreateTable
CREATE TABLE "voucher_referral" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voucher_referral_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_referral" ADD CONSTRAINT "voucher_referral_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
