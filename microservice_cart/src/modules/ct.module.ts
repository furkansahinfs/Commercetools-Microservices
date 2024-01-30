import { Module } from "@nestjs/common";
import { CartController } from "src/controller";
import { CartService } from "src/services";

@Module({
  providers: [CartController],
  controllers: [CartService],
})
export class CommercetoolsModule {}
