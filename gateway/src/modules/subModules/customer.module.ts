import { Module } from "@nestjs/common";
import { CTCustomerController } from "src/controller";
import { CTCustomerService } from "src/services";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { ResponseStatusInterceptor } from "src/middleware";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MICROSERVICE_CUSTOMER",
        transport: Transport.TCP,
        options: {
          host: process.env.CLIENT_HOST,
          port: process.env.CUSTOMER_CLIENT_PORT as unknown as number,
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
  controllers: [CTCustomerController],
  providers: [
    CTCustomerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStatusInterceptor,
    },
  ],
})
export class CustomerModule {}
