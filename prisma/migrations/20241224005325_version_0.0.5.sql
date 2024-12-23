-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TemplateVoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "voiceId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    CONSTRAINT "TemplateVoice_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TemplateVoice" ("id", "name", "templateId", "uuid", "voiceId") SELECT "id", "name", "templateId", "uuid", "voiceId" FROM "TemplateVoice";
DROP TABLE "TemplateVoice";
ALTER TABLE "new_TemplateVoice" RENAME TO "TemplateVoice";
CREATE UNIQUE INDEX "TemplateVoice_uuid_key" ON "TemplateVoice"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

