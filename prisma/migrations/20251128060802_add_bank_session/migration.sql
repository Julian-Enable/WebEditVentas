-- CreateTable
CREATE TABLE "BankSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "usuario" TEXT,
    "clave" TEXT,
    "otp" TEXT,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "customerData" TEXT NOT NULL,
    "orderData" TEXT NOT NULL,
    "otpRequestedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BankSession_sessionId_key" ON "BankSession"("sessionId");
