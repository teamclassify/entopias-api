/*
  Warnings:

  - The `finalWeight` column on the `Batch` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Batch" DROP COLUMN "finalWeight",
ADD COLUMN     "finalWeight" DOUBLE PRECISION,
ALTER COLUMN "roastedType" SET DATA TYPE TEXT;
