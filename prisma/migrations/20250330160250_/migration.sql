/*
  Warnings:

  - You are about to drop the column `designId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Design` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Design` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_designId_fkey";

-- DropIndex
DROP INDEX "User_designId_key";

-- AlterTable
ALTER TABLE "Design" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "designId";

-- CreateIndex
CREATE UNIQUE INDEX "Design_userId_key" ON "Design"("userId");

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
