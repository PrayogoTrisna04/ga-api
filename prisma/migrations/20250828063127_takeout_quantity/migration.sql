/*
  Warnings:

  - You are about to drop the column `quantity` on the `Asset` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isMaintenance" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Asset" ("categoryId", "code", "createdAt", "id", "isMaintenance", "is_deleted", "name") SELECT "categoryId", "code", "createdAt", "id", "isMaintenance", "is_deleted", "name" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
CREATE UNIQUE INDEX "Asset_code_key" ON "Asset"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
