/*
  Warnings:

  - Added the required column `precioGranoVerde` to the `Cafe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaCaducidad` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaMolido` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cafe" ADD COLUMN     "precioGranoVerde" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fechaCaducidad" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaMolido" TIMESTAMP(3) NOT NULL;
