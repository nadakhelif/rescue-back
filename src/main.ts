import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import {IoAdapter} from "@nestjs/platform-socket.io";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix('api');
}
bootstrap();
