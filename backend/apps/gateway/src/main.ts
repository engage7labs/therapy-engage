import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend development
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://134.149.41.178.sslip.io",
      "https://20.82.234.39.sslip.io",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT || 3001;
  console.log(`Starting server on port ${port}`);

  await app.listen(port, "0.0.0.0");
  console.log(`Server is running on http://0.0.0.0:${port}`);
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
