-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referred_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referred_by_id_fkey" FOREIGN KEY ("referred_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
