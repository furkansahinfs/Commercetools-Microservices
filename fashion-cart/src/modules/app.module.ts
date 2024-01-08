import { Module } from "@nestjs/common";
import { CTCartController, CTOrderController } from "src/controller";
import { CTCartService, CTOrderService } from "src/services";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";

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
  controllers: [CTCartController, CTOrderController],
  providers: [CTCartService, CTOrderService],
})
export class AppModule {}
