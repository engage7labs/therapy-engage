import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT || 3000;
  console.log(`Starting server on port ${port}`);
  
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on http://0.0.0.0:${port}`);
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});