/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `Progress` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Progress_new" AS ENUM ('NOT_STARTED', 'IN_REVIEW', 'COMPLETED');
ALTER TABLE "ParticipantTask" ALTER COLUMN "progress" DROP DEFAULT;
ALTER TABLE "ParticipantTask" ALTER COLUMN "progress" TYPE "Progress_new" USING ("progress"::text::"Progress_new");
ALTER TYPE "Progress" RENAME TO "Progress_old";
ALTER TYPE "Progress_new" RENAME TO "Progress";
DROP TYPE "Progress_old";
ALTER TABLE "ParticipantTask" ALTER COLUMN "progress" SET DEFAULT 'NOT_STARTED';
COMMIT;
