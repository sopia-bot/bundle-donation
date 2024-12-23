-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TemplateVoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "voiceId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    CONSTRAINT "TemplateVoice_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TemplateVoice" ("id", "name", "templateId", "voiceId") SELECT "id", "name", "templateId", "voiceId" FROM "TemplateVoice";
DROP TABLE "TemplateVoice";
ALTER TABLE "new_TemplateVoice" RENAME TO "TemplateVoice";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

