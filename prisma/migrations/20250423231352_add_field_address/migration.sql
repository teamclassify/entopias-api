/*
  Warnings:

  - Added the required column `address` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "address" TEXT NOT NULL;
