import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Enable validation pipes
    app.useGlobalPipes(new ValidationPipe());
  
    // Enable CORS
    app.enableCors();
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
