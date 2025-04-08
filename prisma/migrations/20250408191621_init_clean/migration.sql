/*
  Warnings:

  - You are about to drop the column `customText` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `fontFamily` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `textPosition` on the `Design` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Design" DROP COLUMN "customText",
DROP COLUMN "fontFamily",
DROP COLUMN "textColor",
DROP COLUMN "textPosition";
