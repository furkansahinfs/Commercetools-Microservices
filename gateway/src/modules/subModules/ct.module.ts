import { Module } from "@nestjs/common";
import {
  CTCartController,
  CTCustomerController,
  CTOrderController,
  CTProductController,
} from "src/controller";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { ResponseStatusInterceptor } from "src/middleware";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CTService } from "src/services/ct.service";

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
      {
        name: "MICROSERVICE_CUSTOMER",
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT_HOST,
          port: process.env.CUSTOMER_CLIENT_PORT as unknown as number,
        },
      },
      {
        name: "MICROSERVICE_ORDER",
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT_HOST,
          port: process.env.ORDER_CLIENT_PORT as unknown as number,
        },
      },
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
  controllers: [
    CTCartController,
    CTCustomerController,
    CTOrderController,
    CTProductController,
  ],
  providers: [
    CTService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStatusInterceptor,
    },
  ],
})
export class CTModule {}
