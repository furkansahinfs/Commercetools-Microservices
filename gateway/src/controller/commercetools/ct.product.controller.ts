import { Controller, Get, Query } from "@nestjs/common";
import { CTService } from "src/services";

/** DTO validated in services */

@Controller("products")
export class CTProductController {
  private path = "products";
  constructor(private readonly ctService: CTService) {}

  @Get()
  async getProducts(@Query() dto) {
    return this.ctService.send(this.path, "get", dto);
  }
}
