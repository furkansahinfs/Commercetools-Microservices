import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CTOrderService } from "src/services";

@Controller()
export class CTOrderController {
  constructor(private readonly ctOrderService: CTOrderService) {}

  @Get("/ct/orders")
  async getOrders(@Query() dto) {
    return this.ctOrderService.getOrders(dto);
  }

  @Get("/ct/orders/me")
  async getMyOrders(@Query() dto) {
    return this.ctOrderService.getMyOrders(dto);
  }

  @Post("/ct/orders")
  async createOrder(@Body() dto) {
    return this.ctOrderService.createOrder(dto);
  }
}
