import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import * as dotenv from "dotenv";
import { ValidationPipe } from "@nestjs/common";
import { promiseMiddleware } from "./middleware/promise.middleware";
import { AllExceptionsFilter } from "./error";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(promiseMiddleware());
  await app.listen(process.env.PORT);
}
bootstrap();
