/*
  Warnings:

  - A unique constraint covering the columns `[email,purpose]` on the table `codes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "codes_email_purpose_key" ON "public"."codes"("email", "purpose");
