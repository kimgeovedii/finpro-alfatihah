/*
  Warnings:

  - Changed the type of `base_price` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "base_price",
ADD COLUMN     "base_price" DOUBLE PRECISION NOT NULL;
