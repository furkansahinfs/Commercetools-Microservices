import { Module } from "@nestjs/common";
import { CartController } from "src/controller";
import { CartService } from "src/services";

@Module({
  controllers: [CartService],
  providers: [CartController],
})
export class CartModule {}
