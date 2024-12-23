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
    "volume" INTEGER NOT NULL DEFAULT 70
);
INSERT INTO "new_Template" ("id", "name", "sticker", "threshold", "useType", "uuid") SELECT "id", "name", "sticker", "threshold", "useType", "uuid" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_uuid_key" ON "Template"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

