/*
  Warnings:

  - You are about to drop the column `isLike` on the `DrinkRating` table. All the data in the column will be lost.
  - Added the required column `rating` to the `DrinkRating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DrinkRating" DROP COLUMN "isLike",
ADD COLUMN     "rating" INTEGER NOT NULL;
