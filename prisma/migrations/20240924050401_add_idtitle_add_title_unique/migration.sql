/*
  Warnings:

  - A unique constraint covering the columns `[idTitle]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Problem_idTitle_key" ON "Problem"("idTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_title_key" ON "Problem"("title");
