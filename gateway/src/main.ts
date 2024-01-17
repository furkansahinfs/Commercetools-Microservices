import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./error";
import { conf } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(conf.PORT);
}
bootstrap();
