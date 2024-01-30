import { Module } from "@nestjs/common";
import { OrderController } from "src/controller";
import { OrderService } from "src/services";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
