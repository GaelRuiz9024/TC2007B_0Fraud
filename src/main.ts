
require('dotenv').config(); 

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express'; // Importar express
import { join } from 'path'; // Importar join
import helmet from 'helmet'; // <--- Importa helmet

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Solo permite recursos del mismo origen por defecto
        scriptSrc: ["'self'"], // Ajusta si necesitas scripts de otros orígenes
        styleSrc: ["'self'", "'unsafe-inline'"], // Permite estilos inline si son necesarios
        // Agrega otras directivas según lo que tu API necesite (imgSrc, connectSrc, etc.)
      },
    },
  }));
    app.enableCors({
    origin: 'http://localhost:3000', // O el puerto donde corra tu Next.js (generalmente 3000 por defecto)
    credentials: true,
  });

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const config = new DocumentBuilder()
  .setTitle("API de Gestión de Usuarios")
  .setDescription("API para gestionar usuarios con autenticación JWT")
  .setVersion("1.0")
  .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, doc);
  await app.listen(process.env.PORT ?? 4000); 
}
bootstrap();
