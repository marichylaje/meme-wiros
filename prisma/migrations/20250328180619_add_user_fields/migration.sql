/*
  Warnings:

  - Added the required column `anioEgreso` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cantidad` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "anioEgreso" INTEGER NOT NULL,
ADD COLUMN     "cantidad" INTEGER NOT NULL;
