-- CreateTable
CREATE TABLE "Cafe" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "finca" TEXT NOT NULL,
    "productor" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "proceso" TEXT NOT NULL,
    "notasOlfativas" TEXT NOT NULL,

    CONSTRAINT "Cafe_pkey" PRIMARY KEY ("id")
);
