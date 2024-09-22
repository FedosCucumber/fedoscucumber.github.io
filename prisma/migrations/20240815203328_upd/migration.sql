/*
  Warnings:

  - You are about to drop the `DrinkFeedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DrinkFeedback" DROP CONSTRAINT "DrinkFeedback_drinkId_fkey";

-- AlterTable
ALTER TABLE "Drinks" ADD COLUMN     "avgRating" DOUBLE PRECISION,
ADD COLUMN     "ratingCount" INTEGER;

-- DropTable
DROP TABLE "DrinkFeedback";

-- CreateTable
CREATE TABLE "DrinkRating" (
    "id" SERIAL NOT NULL,
    "drinkId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "isLike" BOOLEAN NOT NULL,

    CONSTRAINT "DrinkRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DrinkRating_drinkId_userId_key" ON "DrinkRating"("drinkId", "userId");

-- AddForeignKey
ALTER TABLE "DrinkRating" ADD CONSTRAINT "DrinkRating_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "Drinks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
