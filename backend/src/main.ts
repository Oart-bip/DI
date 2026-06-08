import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilita CORS para o frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  // validacao global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // remove campos nao declarados no DTO
      forbidNonWhitelisted: true, // retorna erro se campos extras forem enviados
      transform: true,           // transforma payloads automaticamente
      errorHttpStatusCode: 422,  // 422 Unprocessable Entity
    }),
  );

  // prefixo global da API
  app.setGlobalPrefix('api');

  const porta = process.env.PORT || 3001;
  await app.listen(porta);
  console.log(`🚀 Backend rodando em http://localhost:${porta}/api`);
}

bootstrap();
