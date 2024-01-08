import { Controller } from "@nestjs/common";
import { GetProductsFilterDTO } from "src/dto";
import { CTProductService } from "src/services";
import { MessagePattern } from "@nestjs/microservices";
import { Payload } from "src/dto/payload";

@Controller()
export class CTProductController {
  constructor(private readonly ctProductService: CTProductService) {}

  @MessagePattern({ role: "products", cmd: "get" })
  async getProducts(payload: Payload<GetProductsFilterDTO>) {
    return await this.ctProductService.getProducts(payload.dto);
  }
}
