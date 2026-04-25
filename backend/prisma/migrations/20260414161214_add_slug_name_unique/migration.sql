/*
  Warnings:

  - A unique constraint covering the columns `[slug_name]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "stock_journals" ALTER COLUMN "created_by" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_name_key" ON "products"("slug_name");
