// gaelruiz9024/tc2007b_0fraud/TC2007B_0Fraud-8e1158653fb11f8ca9309965a9db6cf6abf1fdce/src/main.ts
/* eslint-disable prettier/prettier */

// Usar require() para dotenv para asegurar que se carga antes de cualquier cosa.
// Esto es importante porque el código de configuración de NestJS (como el de DbModule y AppModule)
// se ejecuta al inicio y necesita acceder a process.env inmediatamente.
require('dotenv').config(); 

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origin: 'http://localhost:3000', // O el puerto donde corra tu Next.js (generalmente 3000 por defecto)
    credentials: true,
  });
  const config = new DocumentBuilder()
  .setTitle("API de Gestión de Usuarios")
  .setDescription("API para gestionar usuarios con autenticación JWT")
  .setVersion("1.0")
  .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, doc);
  // process.env.PORT ya debería estar cargado aquí
  await app.listen(process.env.PORT ?? 4000); 
}
bootstrap();