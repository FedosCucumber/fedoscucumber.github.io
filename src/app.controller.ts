import {Controller, Get, Post, Render, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {DrinksService} from './drinks/drinks.service';
import {ApiExcludeController} from '@nestjs/swagger';
import Session from "supertokens-node/recipe/session"
import UserRoles from "supertokens-node/recipe/userroles";
import {Response} from 'express';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly drinkService: DrinksService) {
  }

  @Get()
  @Render("index")
  async getIndex(@Req() req: Request, @Res() res: Response) {
    const session = await Session.getSession(req, res, {sessionRequired: false})

    const drinks = await this.drinkService.getDrinks()

    if (session) {
      const userId = session.getUserId();
      const rls = (await UserRoles.getRolesForUser("public", session.getUserId())).roles

      const drinksWithUserRating = await Promise.all(drinks.map(async (drink) => {
        const userRating = await this.drinkService.getUserRating(drink.id, userId);
        return {
          ...drink,
          userRating: userRating,
        };
      }));

      return {
        drinks: drinksWithUserRating,
        session: true,
        manager: rls.includes("Admin")
      }
    }

    return {
      drinks: drinks,
      session: false,
      manager: false
    }
  }

  @Get('login')
  @Render('login')
  getLogin() {
    return
  }

  @Post('api/refresh-session')
  async refreshSession(@Req() req: Request, @Res() res: Response) {
    try {
      await Session.getSession(req, res, {sessionRequired: false});
      const newSession = await Session.refreshSession(req, res);
      res.json({newSession});
    } catch (err) {
      if (err.type === 'TRY_REFRESH_TOKEN') {
        await Session.refreshSession(req, res);
        res.status(200).json({message: "session refreshed"})
      }
      res.status(200)
    }
  }
}