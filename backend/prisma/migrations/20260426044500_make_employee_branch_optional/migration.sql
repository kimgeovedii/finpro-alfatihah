-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "district" TEXT,
ADD COLUMN     "village" TEXT;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "branch_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_referal_code_key" ON "User"("referal_code");
