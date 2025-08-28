-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE');

-- CreateTable
CREATE TABLE "Favourite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'GOOGLE',
    "placeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "photoRef" TEXT,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favourite_userId_provider_placeId_key" ON "Favourite"("userId", "provider", "placeId");

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
