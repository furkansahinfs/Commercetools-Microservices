import { Module } from "@nestjs/common";
import { CTCartController } from "src/controller";
import { CTCartService } from "src/services";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { ResponseStatusInterceptor } from "src/middleware";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MICROSERVICE_CART",
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT_HOST,
          port: process.env.CART_CLIENT_PORT as unknown as number,
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
  controllers: [CTCartController],
  providers: [
    CTCartService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStatusInterceptor,
    },
  ],
})
export class CartModule {}
