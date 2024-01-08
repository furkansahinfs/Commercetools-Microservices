import { Controller, Get, Query } from "@nestjs/common";
import { CTProductService } from "src/services";

@Controller()
export class CTProductController {
  constructor(private readonly ctProductService: CTProductService) {}

  @Get("/ct/products")
  async getProducts(@Query() dto) {
    return this.ctProductService.getProducts(dto);
  }
}
