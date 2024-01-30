import { Controller } from "@nestjs/common";
import { GetProductsFilterPayload } from "src/dto";
import { ProductService } from "src/services";
import { MessagePattern } from "@nestjs/microservices";
import { IResponse, QueryData } from "src/types";
import { Product } from "@commercetools/platform-sdk";

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ role: "products", cmd: "get" })
  async getProducts(
    payload: GetProductsFilterPayload,
  ): Promise<IResponse<QueryData<Product>>> {
    return this.productService.getProducts(payload.dto);
  }
}
