import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para o frontend Next.js
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // retorna erro se campos extras forem enviados
      transform: true,           // transforma payloads automaticamente
      errorHttpStatusCode: 422,  // Unprocessable Entity para erros de validação
    }),
  );

  // Prefixo global da API
  app.setGlobalPrefix('api');

  const porta = process.env.PORT || 3001;
  await app.listen(porta);
  console.log(`🚀 Backend rodando em http://localhost:${porta}/api`);
}

bootstrap();
