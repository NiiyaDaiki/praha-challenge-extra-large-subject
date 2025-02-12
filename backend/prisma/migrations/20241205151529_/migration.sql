/*
  Warnings:

  - A unique constraint covering the columns `[participantId,taskId]` on the table `ParticipantTask` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ParticipantTask_participantId_taskId_key" ON "ParticipantTask"("participantId", "taskId");
