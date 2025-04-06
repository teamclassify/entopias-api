/*
  Warnings:

  - You are about to drop the column `cafeId` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `fechaLote` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `fechaTostado` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `pesoCafe` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `tipoTueste` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCaducidad` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `fechaMolido` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `loteId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Cafe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fecha_caducidad` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_tostado` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_product` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_productor` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notas_olfativas` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso_comprado` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso_final` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_tostado` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lote" DROP CONSTRAINT "Lote_cafeId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_loteId_fkey";

-- AlterTable
ALTER TABLE "Lote" DROP COLUMN "cafeId",
DROP COLUMN "fechaLote",
DROP COLUMN "fechaTostado",
DROP COLUMN "pesoCafe",
DROP COLUMN "tipoTueste",
ADD COLUMN     "fecha_caducidad" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fecha_tostado" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id_product" INTEGER NOT NULL,
ADD COLUMN     "id_productor" INTEGER NOT NULL,
ADD COLUMN     "notas_olfativas" TEXT NOT NULL,
ADD COLUMN     "peso_comprado" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "peso_final" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precio_compra_grano" DOUBLE PRECISION,
ADD COLUMN     "tipo_tostado" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "fechaCaducidad",
DROP COLUMN "fechaMolido",
DROP COLUMN "loteId",
DROP COLUMN "name",
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL;

-- DropTable
DROP TABLE "Cafe";

-- CreateTable
CREATE TABLE "ProductPhoto" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "finca" TEXT,
    "direccion" TEXT,
    "telefono" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "pais" TEXT NOT NULL,

    CONSTRAINT "Productor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variedad" (
    "id" SERIAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Variedad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductPhoto" ADD CONSTRAINT "ProductPhoto_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_id_productor_fkey" FOREIGN KEY ("id_productor") REFERENCES "Productor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variedad" ADD CONSTRAINT "Variedad_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
