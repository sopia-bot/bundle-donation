-- CreateTable
CREATE TABLE "Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dummy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TemplateVoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    CONSTRAINT "TemplateVoice_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_uuid_key" ON "Template"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVoice_uuid_key" ON "TemplateVoice"("uuid");

