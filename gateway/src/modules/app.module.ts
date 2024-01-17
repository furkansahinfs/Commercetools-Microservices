import { MiddlewareConsumer, Module } from "@nestjs/common";
import {
  AuthController,
  CTCartController,
  CTCustomerController,
  CTOrderController,
  CTProductController,
  UserController,
} from "src/controller";
import {
  AuthService,
  CTCartService,
  CTCustomerService,
  CTOrderService,
  CTProductService,
} from "src/services";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { JWTMiddleware, ResponseStatusInterceptor } from "src/middleware";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { HttpModule } from "@nestjs/axios";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
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
        path: path.join(__dirname, "/../i18n/"),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    CTCartController,
    CTCustomerController,
    CTOrderController,
    CTProductController,
  ],
  providers: [
    AuthService,
    CTCartService,
    CTCustomerService,
    CTOrderService,
    CTProductService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStatusInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTMiddleware)
      .exclude("/auth/login", "/auth/register", "/products", "/customers/new")
      .forRoutes("/");
  }
}
