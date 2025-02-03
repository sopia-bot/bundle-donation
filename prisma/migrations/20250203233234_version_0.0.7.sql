-- CreateTable
CREATE TABLE "Effect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sticker" TEXT NOT NULL,
    "sound" BLOB NOT NULL,
    "soundName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "volume" INTEGER NOT NULL DEFAULT 50,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chatInputTimeout" INTEGER NOT NULL DEFAULT 30,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
    "volume" INTEGER NOT NULL DEFAULT 70,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Template" ("id", "name", "sticker", "threshold", "useType", "uuid", "volume") SELECT "id", "name", "sticker", "threshold", "useType", "uuid", "volume" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_uuid_key" ON "Template"("uuid");
CREATE TABLE "new_TemplateVoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "voiceId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TemplateVoice_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TemplateVoice" ("id", "name", "templateId", "voiceId") SELECT "id", "name", "templateId", "voiceId" FROM "TemplateVoice";
DROP TABLE "TemplateVoice";
ALTER TABLE "new_TemplateVoice" RENAME TO "TemplateVoice";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Effect_id_key" ON "Effect"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Effect_sticker_key" ON "Effect"("sticker");

