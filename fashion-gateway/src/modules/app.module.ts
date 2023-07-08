import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AuthController, UserController } from "src/controller";
import { AuthService, UserService } from "src/services";
import { PrismaService } from "src/services/prisma.service";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { JWTMiddleware } from "src/middleware";
import { CTService } from "src/services/ct.service";
import { CTController } from "src/controller/ct.controller";

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
  controllers: [AuthController, UserController, CTController],
  providers: [PrismaService, AuthService, UserService, CTService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTMiddleware)
      .exclude("/auth/login", "/auth/register")
      .forRoutes("/");
  }
}
