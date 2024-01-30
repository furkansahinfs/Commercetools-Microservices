import { Module } from "@nestjs/common";
import { ProductController } from "src/controller";
import { ProductService } from "src/services";

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
