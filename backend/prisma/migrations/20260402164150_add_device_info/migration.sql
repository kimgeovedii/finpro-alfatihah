-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "device" TEXT,
ADD COLUMN     "ip" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLogin" TIMESTAMP(3);
