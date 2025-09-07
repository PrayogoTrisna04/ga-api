/*
  Warnings:

  - You are about to drop the `AssetAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcurementRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubmissionDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorQuote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `approvedAt` on the `Approval` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `Approval` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `Approval` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Approval` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PurchaseOrder_procurementId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AssetAssignment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProcurementRequest";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PurchaseOrder";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SubmissionDetail";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vendor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VendorProduct";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VendorQuote";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Approval" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "submissionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "approvedBy" TEXT,
    "assetsRequest" TEXT,
    "createdBy" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Approval" ("approvedBy", "createdAt", "id", "notes", "requestedBy", "status", "submissionType") SELECT "approvedBy", "createdAt", "id", "notes", "requestedBy", "status", "submissionType" FROM "Approval";
DROP TABLE "Approval";
ALTER TABLE "new_Approval" RENAME TO "Approval";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
