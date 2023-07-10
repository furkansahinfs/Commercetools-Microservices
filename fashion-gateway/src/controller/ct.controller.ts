import { Controller, Get, Query } from "@nestjs/common";
import { CTService } from "src/services/ct.service";

@Controller()
export class CTController {
  constructor(private readonly ctService: CTService) {}

  @Get("/ct/products")
  async getProducts(@Query() dto) {
    return this.ctService.getProducts(dto);
  }

  @Get("/ct/orders")
  async getOrders(@Query() dto) {
    return this.ctService.getOrders(dto);
  }

  @Get("/ct/me")
  async getMe(@Query() dto) {
    return this.ctService.me(dto);
  }
}
