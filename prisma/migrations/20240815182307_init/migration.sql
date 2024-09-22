-- CreateTable
CREATE TABLE "Drinks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "abv" INTEGER NOT NULL DEFAULT 1,
    "ibu" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Drinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrinkFeedback" (
    "id" SERIAL NOT NULL,
    "drinkId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "isLike" BOOLEAN NOT NULL,

    CONSTRAINT "DrinkFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DrinkFeedback_drinkId_userId_key" ON "DrinkFeedback"("drinkId", "userId");

-- AddForeignKey
ALTER TABLE "DrinkFeedback" ADD CONSTRAINT "DrinkFeedback_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "Drinks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
