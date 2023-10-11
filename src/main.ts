import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: true,
      logger: ['error', 'warn', 'log'], // <--- Add this line in options object
    },
  );

  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(4200);
}
bootstrap();
