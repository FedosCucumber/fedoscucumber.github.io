import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as hbs from 'hbs';
import {join, resolve} from 'path';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {SupertokensExceptionFilter} from './auth/auth.filter';
import {TimingInterceptor} from "./timing.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder().build();
  const swaggerDoucment = SwaggerModule.createDocument(app, config);

  app.setBaseViewsDir(resolve('./src/views'))
  app.setViewEngine('hbs');

  app.useStaticAssets(resolve('./src/public'));
  hbs.registerPartials(resolve('./src/views/partials'));

  hbs.registerHelper('greaterOrEqual', function (value, compare) {
    return value >= compare;
  });

  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('swagger', app, swaggerDoucment);
  app.useGlobalFilters(new SupertokensExceptionFilter());

  app.useGlobalInterceptors(new TimingInterceptor)

  await app.listen(3000);
}

bootstrap();