-- AlterTable
ALTER TABLE "Cafe" ALTER COLUMN "precioGranoVerde" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "fechaCaducidad" DROP NOT NULL,
ALTER COLUMN "fechaMolido" DROP NOT NULL;
