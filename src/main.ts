import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  AppModule.configureSwagger(app);

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().build(),
  );
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
