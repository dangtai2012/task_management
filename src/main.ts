import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './system';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //#region Inject Config
  const appConfigService = app.get(AppConfig);
  //#endregion

  //#region Config

  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '50mb' });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  //#endregion

  const port = appConfigService.getPort();
  await app.listen(port, () => {
    console.log(`Application listen in ${port}`);
  });
}
bootstrap();
