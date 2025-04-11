-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('POR_HACER', 'EN_PROCESO', 'HECHO', 'ENTREGADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombreColegio" TEXT NOT NULL,
    "nombreCurso" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "anioEgreso" INTEGER NOT NULL,
    "telefono" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'POR_HACER',
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "senia" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "layerColors" TEXT NOT NULL,
    "texts" JSONB,
    "images" JSONB,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Design_userId_key" ON "Design"("userId");

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
