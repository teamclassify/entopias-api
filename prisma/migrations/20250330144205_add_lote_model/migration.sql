-- CreateTable
CREATE TABLE "Lote" (
    "id" SERIAL NOT NULL,
    "pesoCafe" DOUBLE PRECISION NOT NULL,
    "tipoTueste" TEXT NOT NULL,
    "fechaTostado" TIMESTAMP(3) NOT NULL,
    "fechaLote" TIMESTAMP(3) NOT NULL,
    "cafeId" INTEGER NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
