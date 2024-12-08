-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Template" ("id", "name", "uuid") SELECT "id", "name", "uuid" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_uuid_key" ON "Template"("uuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

