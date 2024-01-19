import { Controller } from "@nestjs/common";
import { GetProductsFilterPayload } from "src/dto";
import { CTProductService } from "src/services";
import { MessagePattern } from "@nestjs/microservices";
import { IResponse, QueryData } from "src/types";
import { Product } from "@commercetools/platform-sdk";

@Controller()
export class CTProductController {
  constructor(private readonly ctProductService: CTProductService) {}

  @MessagePattern({ role: "products", cmd: "get" })
  async getProducts(
    payload: GetProductsFilterPayload,
  ): Promise<IResponse<QueryData<Product>>> {
    return await this.ctProductService.getProducts(payload.dto);
  }
}
