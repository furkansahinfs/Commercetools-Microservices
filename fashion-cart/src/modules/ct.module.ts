import { Module } from "@nestjs/common";
import { CTCartController } from "src/controller";
import { CTCartService } from "src/services";

@Module({
  providers: [CTCartController],
  controllers: [CTCartService],
})
export class CommercetoolsModule {}
