import { Module } from '@nestjs/common';
import { DrinksService } from './drinks.service';
import { PrismaService } from 'src/prisma.service';
import { DrinksController } from './drinks.controller';

@Module({
  controllers: [DrinksController],
  providers: [DrinksService, PrismaService]
})
export class DrinksModule {}
