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
      connectionURI: "https://st-dev-95de4780-7c38-11ef-b5a5-67f4d59aff6d.aws.supertokens.io", //Supertokens
      apiKey: "f441rD6UA6bZbkvZkdmSV3EC5p", //Supertokens
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
