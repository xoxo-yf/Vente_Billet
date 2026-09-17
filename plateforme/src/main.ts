import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js'; // On importe ObserveInstrument ici

async function bootstrap() {
  // On passe l'instrument en option lors de la création de l'application
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Permet à votre future interface (Frontend) de communiquer avec l'API sans blocage CORS
  app.enableCors();

  // Active la validation des formulaires avec des messages d'erreur clairs en français
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 L'API est lancée avec succès sur : http://localhost:3000`);
}
bootstrap();
