import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  app.enableCors({ exposedHeaders: ['Content-Disposition'] });
  await app.listen(3001);
  console.log(`API server is running at 3001 🚀`);
}
bootstrap();
