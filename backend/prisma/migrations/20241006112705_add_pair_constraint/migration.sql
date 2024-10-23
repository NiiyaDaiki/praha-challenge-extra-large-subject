/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Pair` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_pairId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Pair_name_key" ON "Pair"("name");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
