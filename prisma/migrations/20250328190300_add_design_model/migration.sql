-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "layerColors" TEXT NOT NULL,
    "customText" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "textPosition" TEXT NOT NULL,
    "fontFamily" TEXT NOT NULL,
    "colegioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_colegioId_fkey" FOREIGN KEY ("colegioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
