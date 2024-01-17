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

@Module({
  imports: [
    HttpModule,
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
