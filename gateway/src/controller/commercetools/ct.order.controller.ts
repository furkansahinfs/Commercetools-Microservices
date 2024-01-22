import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CTService } from "src/services";

/** DTO validated in services */

@Controller("orders")
export class CTOrderController {
  private path = "orders";
  constructor(private readonly ctService: CTService) {}

  @Get()
  async getOrders(@Query() dto) {
    return this.ctService.send(this.path, "get", dto);
  }

  @Get("/me")
  async getMyOrders(@Query() dto) {
    return this.ctService.send(this.path, "get/me", dto);
  }

  @Post()
  async createOrder(@Body() dto) {
    return this.ctService.send(this.path, "post", dto);
  }
}
