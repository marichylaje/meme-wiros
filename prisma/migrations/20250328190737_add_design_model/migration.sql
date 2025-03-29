/*
  Warnings:

  - A unique constraint covering the columns `[colegioId]` on the table `Design` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Design_colegioId_key" ON "Design"("colegioId");
