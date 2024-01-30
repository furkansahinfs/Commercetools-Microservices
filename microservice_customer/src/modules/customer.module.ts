import { Module } from "@nestjs/common";
import { CustomerController } from "src/controller";
import { CustomerService } from "src/services";

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
