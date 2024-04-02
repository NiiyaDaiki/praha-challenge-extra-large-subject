-- DropForeignKey
ALTER TABLE "ParticipantTask" DROP CONSTRAINT "ParticipantTask_participantId_fkey";

-- AddForeignKey
ALTER TABLE "ParticipantTask" ADD CONSTRAINT "ParticipantTask_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
