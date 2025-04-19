/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Producer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Producer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Producer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Producer_name_key" ON "Producer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_email_key" ON "Producer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_phone_key" ON "Producer"("phone");
