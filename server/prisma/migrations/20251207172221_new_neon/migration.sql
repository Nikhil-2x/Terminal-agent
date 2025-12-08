/*
  Warnings:

  - You are about to drop the column `coneversationId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_coneversationId_fkey";

-- DropIndex
DROP INDEX "Message_coneversationId_idx";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "coneversationId",
ADD COLUMN     "conversationId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
