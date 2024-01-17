import { Module } from "@nestjs/common";
import { AuthController, UserController } from "src/controller";
import { AuthService, CTCustomerService, UserService } from "src/services";
import { PrismaService } from "src/services/prisma.service";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { ResponseStatusInterceptor } from "src/middleware";
import { UserRepository } from "src/repository/user.repository";
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
  controllers: [AuthController, UserController],
  providers: [
    PrismaService,
    AuthService,
    UserService,
    CTCustomerService,
    UserRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStatusInterceptor,
    },
  ],
})
export class AppModule {}
