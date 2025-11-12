import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Validate required environment variables
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  console.log('Starting NgPodium Backend...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
  console.log('JWT_SECRET configured:', !!process.env.JWT_SECRET);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS with production configuration
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Serve static files from uploads directory
  const uploadsPath = join(process.cwd(), 'uploads');
  console.log('Serving static files from:', uploadsPath);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // Set global prefix for API routes
  app.setGlobalPrefix('api/v1');

  // Setup Swagger documentation (enabled in all environments)
  const config = new DocumentBuilder()
    .setTitle('NgPodium API')
    .setDescription('API documentation for NgPodium')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger is running on: ${await app.getUrl()}/api/v1/docs`);
}

bootstrap().catch(err => {
  console.error('Error starting application:', err);
  process.exit(1);
});
