import {Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma.service';
import {CreateDrinkDto, drinkDto} from './drinks.entity';
import {Drinks} from '@prisma/client';

@Injectable()
export class DrinksService {
  constructor(
    private prisma: PrismaService
  ) {
  }

  async getDrinks() {
    const drinks = await this.prisma.drinks.findMany({
      include: {
        ratings: true
      }
    });

    return drinks.map(drink => {
      const ratingCount = drink.ratings.length;
      const avgRating = ratingCount > 0
        ? drink.ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratingCount
        : 0;

      const roundedAvgRating = Math.round(avgRating * 10) / 10;

      return {
        ...drink,
        avgRating: roundedAvgRating,
        ratingCount
      };
    });
  }

  async createDrink(createDrinkDto: CreateDrinkDto) {
    const newDrink = new drinkDto()

    newDrink.name = createDrinkDto.name
    newDrink.description = createDrinkDto.description
    newDrink.abv = createDrinkDto.abv
    newDrink.ibu = createDrinkDto.ibu
    newDrink.imageUrl = createDrinkDto.imageUrl

    return this.prisma.drinks.create({
      data: newDrink
    });
  }

  async getAllDrinks(): Promise<Drinks[]> {
    const drinks = await this.prisma.drinks.findMany({
      include: {
        ratings: true
      }
    });

    return drinks.map(drink => {
      const ratingSum = drink.ratings.reduce((sum, r) => sum + r.rating, 0);
      const ratingCount = drink.ratings.length;
      return {
        ...drink,
        avgRating: ratingCount > 0 ? ratingSum / ratingCount : null,
        ratingCount: ratingCount,
      };
    });
  }

  async deleteDrink(DrinkId: number): Promise<drinkDto> {
    await this.prisma.drinkRating.deleteMany({
      where: {
        drinkId: DrinkId
      }
    })

    return await this.prisma.drinks.delete({
      where: {
        id: DrinkId
      }
    })
  }

  async rateDrink(drinkId: number, userId: string, rating: number): Promise<void> {
    await this.prisma.drinkRating.upsert({
      where: {
        drinkId_userId: {drinkId, userId},
      },
      update: {
        rating,
      },
      create: {
        drinkId,
        userId,
        rating,
      },
    });
  }

  async getUserRating(drinkId, userId) {
    const rating = await this.prisma.drinkRating.findUnique({
      where: {
        drinkId_userId: {drinkId, userId}
      }
    })

    if (rating) {
      return rating["rating"]
    }

    return 0
  }

  async updateDrinkImage(drinkId: number, imageUrl: string) {
    return this.prisma.drinks.update({
      where: {id: drinkId},
      data: {imageUrl},
    });
  }
}
