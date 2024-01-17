import { Controller, Get, Query } from "@nestjs/common";
import { CTProductService } from "src/services";

/** DTO validated in services */

@Controller("products")
export class CTProductController {
  constructor(private readonly ctProductService: CTProductService) {}

  @Get()
  async getProducts(@Query() dto) {
    return this.ctProductService.getProducts(dto);
  }
}
