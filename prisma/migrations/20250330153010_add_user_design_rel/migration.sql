/*
  Warnings:

  - You are about to drop the column `colegioId` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[designId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Design" DROP CONSTRAINT "Design_colegioId_fkey";

-- DropIndex
DROP INDEX "Design_colegioId_key";

-- AlterTable
ALTER TABLE "Design" DROP COLUMN "colegioId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "designId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_designId_key" ON "User"("designId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;
