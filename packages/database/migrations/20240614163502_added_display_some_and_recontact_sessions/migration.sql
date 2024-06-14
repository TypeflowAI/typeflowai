-- AlterEnum
ALTER TYPE "displayOptions" ADD VALUE 'displaySome';

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "displayLimit" INTEGER;
