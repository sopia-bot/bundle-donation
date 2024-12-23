-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "useType" INTEGER NOT NULL,
    "sticker" TEXT,
    "threshold" INTEGER,
    "volumn" INTEGER NOT NULL
);
INSERT INTO "new_Template" ("id", "name", "uuid") SELECT "id", "name", "uuid" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_uuid_key" ON "Template"("uuid");
CREATE TABLE "new_TemplateVoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "voiceId" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    CONSTRAINT "TemplateVoice_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TemplateVoice" ("id", "name", "templateId", "uuid") SELECT "id", "name", "templateId", "uuid" FROM "TemplateVoice";
DROP TABLE "TemplateVoice";
ALTER TABLE "new_TemplateVoice" RENAME TO "TemplateVoice";
CREATE UNIQUE INDEX "TemplateVoice_uuid_key" ON "TemplateVoice"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

