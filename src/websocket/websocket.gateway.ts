import {UseGuards} from '@nestjs/common';
import {ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody} from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import {CreateDrinkDto} from 'src/drinks/drinks.entity';
import {DrinksService} from 'src/drinks/drinks.service';
import Session from 'supertokens-node/recipe/session';
import {AuthWebsocketGuard} from "src/auth/authwebsocket.guard"

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer() server: Server;

  constructor(private drinksService: DrinksService) {
  }

  @SubscribeMessage("createDrink")
  @UseGuards(new AuthWebsocketGuard())
  async handleCreateDrink(
    @MessageBody() data: CreateDrinkDto,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    if (data) {
      await this.drinksService.createDrink(data)
      this.server.emit("drinksUpdate", await this.drinksService.getDrinks())
    }
  }

  @SubscribeMessage("deleteDrink")
  @UseGuards(new AuthWebsocketGuard())
  async handleDeleteDrink(
    @MessageBody() drinkId: number,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    if (drinkId) {
      await this.drinksService.deleteDrink(drinkId)
      this.server.emit("drinksUpdate", await this.drinksService.getDrinks())
    }
  }

  @SubscribeMessage("rateDrink")
  @UseGuards(new AuthWebsocketGuard())
  async handleRating(
    @MessageBody() data: {
      drinkId: number,
      rating: number
    },
    @ConnectedSocket() client: Socket): Promise<void> {
    const accessToken = client.handshake.headers.cookie.split("; ")[0].split("sAccessToken=")[1];

    if (!accessToken) {
      console.log("No access token provided");
      return;
    }
    const session = await Session.getSessionWithoutRequestResponse(accessToken, null);
    const userId = session.getUserId();

    if (data && userId) {
      await this.drinksService.rateDrink(data.drinkId, userId, data.rating)
      this.server.emit("drinksUpdate", await this.drinksService.getDrinks())
    }
  }

}
