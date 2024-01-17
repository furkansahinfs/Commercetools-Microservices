import { MiddlewareConsumer, Module } from "@nestjs/common";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { JWTMiddleware, ResponseStatusInterceptor } from "src/middleware";
import { APP_INTERCEPTOR } from "@nestjs/core";
import {
  AuthModule,
  CartModule,
  CustomerModule,
  OrderModule,
  ProductModule,
} from "./services";
import { AuthService } from "src/services";
import { HttpModule } from "@nestjs/axios";
import { ClientsModule } from "@nestjs/microservices";

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
    HttpModule,
    ClientsModule,
    AuthModule,
    CartModule,
    CustomerModule,
    OrderModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    AuthService,
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
