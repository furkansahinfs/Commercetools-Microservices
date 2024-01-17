import { Module } from "@nestjs/common";
import { CTProductController } from "src/controller";
import { CTProductService } from "src/services";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { ResponseStatusInterceptor } from "src/middleware";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MICROSERVICE_PRODUCT",
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT_HOST,
          port: process.env.PRODUCT_CLIENT_PORT as unknown as number,
        },
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/../../i18n/"),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  controllers: [CTProductController],
  providers: [
    CTProductService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStatusInterceptor,
    },
  ],
})
export class ProductModule {}
