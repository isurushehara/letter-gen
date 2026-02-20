-- AlterTable
ALTER TABLE "Letter" ADD COLUMN "templateId" TEXT,
ADD COLUMN "inputValues" JSONB;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_templateId_fkey"
FOREIGN KEY ("templateId") REFERENCES "Template"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
