import { Module } from "@nestjs/common";
import { CTProductController } from "src/controller";
import { CTProductService } from "src/services";

@Module({
  providers: [CTProductService],
  controllers: [CTProductController],
})
export class CommercetoolsModule {}
