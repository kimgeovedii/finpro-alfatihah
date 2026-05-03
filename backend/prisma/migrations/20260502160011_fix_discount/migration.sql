/*
  Warnings:

  - Made the column `discount_value` on table `discounts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "discounts" ALTER COLUMN "discount_value" SET NOT NULL;
