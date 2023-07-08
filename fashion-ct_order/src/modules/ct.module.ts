import { Module } from "@nestjs/common";
import { CTCartController, CTOrderController } from "src/controller";
import { CTCartService, CTOrderService } from "src/services";

@Module({
  providers: [CTCartController, CTOrderController],
  controllers: [CTCartService, CTOrderService],
})
export class CommercetoolsModule {}
