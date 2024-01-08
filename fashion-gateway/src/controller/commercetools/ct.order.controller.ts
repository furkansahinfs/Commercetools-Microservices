import { Controller, Get, Query } from "@nestjs/common";
import { CTOrderService } from "src/services";

@Controller()
export class CTOrderController {
  constructor(private readonly ctOrderService: CTOrderService) {}

  @Get("/ct/orders")
  async getOrders(@Query() dto) {
    return this.ctOrderService.getOrders(dto);
  }
}
