import { Controller } from "@nestjs/common";
import { GetProductsFilterPayload } from "src/dto";
import { CTProductService } from "src/services";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class CTProductController {
  constructor(private readonly ctProductService: CTProductService) {}

  @MessagePattern({ role: "products", cmd: "get" })
  async getProducts(payload: GetProductsFilterPayload) {
    return await this.ctProductService.getProducts(payload.dto);
  }
}
