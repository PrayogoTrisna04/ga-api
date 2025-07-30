/*
  Warnings:

  - Added the required column `submissionId` to the `Approval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionType` to the `Approval` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SubmissionDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionType" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assetId" TEXT,
    "condition" TEXT,
    "location" TEXT,
    "reason" TEXT,
    "urgency" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Approval" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "submissionId" TEXT NOT NULL,
    "submissionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting_approval',
    "notes" TEXT,
    "requestedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "assetId" TEXT,
    CONSTRAINT "Approval_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SubmissionDetail" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Approval_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Approval" ("approvedAt", "approvedBy", "assetId", "id", "notes", "requestedBy", "status") SELECT "approvedAt", "approvedBy", "assetId", "id", "notes", "requestedBy", "status" FROM "Approval";
DROP TABLE "Approval";
ALTER TABLE "new_Approval" RENAME TO "Approval";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
