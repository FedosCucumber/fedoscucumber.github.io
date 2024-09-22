import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { DrinksController } from './drinks/drinks.controller';
import { DrinksModule } from './drinks/drinks.module';
import { DrinksService } from './drinks/drinks.service';
import { AuthModule } from './auth/auth.module';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Module({
  imports: [
    DrinksModule,
    AuthModule.forRoot({
      connectionURI: "https://st-dev-333e1ef0-0e26-11ef-9c89-4d0da2ea0d9d.aws.supertokens.io", //Supertokens
      apiKey: "74LaUAizR3dCvkaUPJnbVHwKcv", //Supertokens
      appInfo: {
        appName: "web-fi",
        apiDomain: "http://localhost:3000",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/auth",
        websiteBasePath: "/auth"
      },
    }),
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    DrinksService,
    PrismaService,
    WebsocketGateway
  ],
})
export class AppModule {}
