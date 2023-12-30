/*
  Warnings:

  - You are about to drop the `SomeData` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('BASIS', 'TEST', 'DATABASE', 'ARCHITECTURE', 'FRONTEND', 'TEAM_DEV', 'MVP');

-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED');

-- DropTable
DROP TABLE "SomeData";

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantTask" (
    "id" TEXT NOT NULL,
    "progress" "Progress" NOT NULL DEFAULT 'NOT_STARTED',
    "participantId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "ParticipantTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParticipantTask" ADD CONSTRAINT "ParticipantTask_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantTask" ADD CONSTRAINT "ParticipantTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
