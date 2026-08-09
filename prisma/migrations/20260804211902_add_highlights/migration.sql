-- CreateEnum
CREATE TYPE "HighlightStyle" AS ENUM ('default', 'underline', 'wave', 'strike');

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "style" "HighlightStyle" NOT NULL,
    "note" TEXT,
    "title" TEXT,
    "favicon" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Highlight_createdById_idx" ON "Highlight"("createdById");

-- CreateIndex
CREATE INDEX "Highlight_createdById_url_idx" ON "Highlight"("createdById", "url");

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
