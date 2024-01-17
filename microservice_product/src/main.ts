import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import * as dotenv from "dotenv";
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from "@nestjs/microservices";
import { ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { getAllConstraints } from "./error";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST,
        port: parseInt(process.env.PORT),
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (validationErrors: ValidationError[]) => {
        throw new RpcException(getAllConstraints(validationErrors));
      },
    }),
  );

  await app.listen();
}
bootstrap();
