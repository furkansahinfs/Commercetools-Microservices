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
  UserService,
} from "src/services";
import { PrismaService } from "src/services/prisma.service";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { JWTMiddleware, ResponseStatusInterceptor } from "src/middleware";
import { UserRepository } from "src/repository/user.repository";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
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
    PrismaService,
    AuthService,
    UserService,
    CTCartService,
    CTCustomerService,
    CTOrderService,
    CTProductService,
    UserRepository,
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
      .exclude("/auth/login", "/auth/register", "/ct/products")
      .forRoutes("/");
  }
}
