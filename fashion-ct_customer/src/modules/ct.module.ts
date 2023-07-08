import { Module } from "@nestjs/common";
import { CTCustomerController } from "src/controller";
import { CTCustomerService } from "src/services";

@Module({
  providers: [CTCustomerService],
  controllers: [CTCustomerController],
})
export class CommercetoolsModule {}
