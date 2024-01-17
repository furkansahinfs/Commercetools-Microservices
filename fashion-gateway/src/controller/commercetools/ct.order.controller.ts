import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CTOrderService } from "src/services";

@Controller("orders")
export class CTOrderController {
  constructor(private readonly ctOrderService: CTOrderService) {}

  @Get()
  async getOrders(@Query() dto) {
    return this.ctOrderService.getOrders(dto);
  }

  @Get("/me")
  async getMyOrders(@Query() dto) {
    return this.ctOrderService.getMyOrders(dto);
  }

  @Post()
  async createOrder(@Body() dto) {
    return this.ctOrderService.createOrder(dto);
  }
}
