import { Module } from "@nestjs/common";
import { CTOrderController } from "src/controller";
import { CTOrderService } from "src/services";

@Module({
  providers: [CTOrderController],
  controllers: [CTOrderService],
})
export class CommercetoolsModule {}
