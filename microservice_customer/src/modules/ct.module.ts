import { Module } from "@nestjs/common";
import { CustomerController } from "src/controller";
import { CustomerService } from "src/services";

@Module({
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CommercetoolsModule {}
