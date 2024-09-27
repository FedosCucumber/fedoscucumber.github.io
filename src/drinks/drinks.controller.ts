import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {DrinksService} from './drinks.service';
import {Drinks} from '@prisma/client';
import {CreateDrinkDto} from './drinks.entity';
import {ApiBasicAuth, ApiOperation, ApiResponse} from '@nestjs/swagger';
import Session from "supertokens-node/recipe/session";
import {Response} from 'express';
import {AuthGuard} from 'src/auth/auth.guard';
import {SessionClaimValidator} from 'supertokens-node/recipe/session';
import UserRoles from "supertokens-node/recipe/userroles";

@Controller('api/drinks')
export class DrinksController {
  constructor(private readonly drinksService: DrinksService) {
  }

  @ApiBasicAuth()
  @ApiOperation({
    summary: "Get All Drinks"
  })
  @ApiResponse({status: 200, description: 'All drinks got'})
  @Get()
  async getDrinks(): Promise<Drinks[]> {
    return this.drinksService.getAllDrinks();
  }

  @ApiBasicAuth()
  @ApiOperation({
    summary: "Create a Drink"
  })
  @ApiResponse({status: 201, description: 'Drink created'})
  @Post()
  @UseGuards(new AuthGuard())
  async createDrink(@Body() data: CreateDrinkDto): Promise<Drinks> {
    return this.drinksService.createDrink(data);
  }

  @ApiBasicAuth()
  @ApiOperation({
    summary: "Delete Drink"
  })
  @Delete(":id")
  @UseGuards(new AuthGuard({
    overrideGlobalClaimValidators: async (globalValidators: SessionClaimValidator[]) => ([
      ...globalValidators,
      UserRoles.PermissionClaim.validators.includes("ADMIN")
    ])
  }))

  async deleteDrink(@Param("id") id: string) {
    return this.drinksService.deleteDrink(+id)
  }

  @ApiBasicAuth()
  @ApiOperation({
    summary: "Rate a drink"
  })
  @Post(':id/rate')
  @UseGuards(new AuthGuard())
  async rateDrink(
    @Param('id') id: number,
    @Body() data: { userId: string; rating: number },
  ): Promise<void> {
    await this.drinksService.rateDrink(+id, data.userId, data.rating);
  }

  @ApiBasicAuth()
  @ApiOperation({
    summary: "Get user rating"
  })
  @Get('/user-rating')
  @UseGuards(new AuthGuard())
  async getUserRation(
    @Req() req: Request,
    @Res() res: Response,
    @Query("drinkId") drinkId: number,
  ) {
    try {
      const session = await Session.getSession(req, res, {sessionRequired: false})
      const userId = session.getUserId()
      if (userId) {
        const rating = await this.drinksService.getUserRating(+drinkId, userId)
        return res.json({rating})
      } else {
        return res.status(404).json({message: "User not found"});
      }
    } catch (err) {
      return res.status(404).json({message: "Not Found"})
    }
  }
}