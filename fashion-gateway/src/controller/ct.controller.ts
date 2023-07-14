import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { CTService } from "src/services/ct.service";

@Controller()
export class CTController {
  constructor(private readonly ctService: CTService) {}

  @Get("/ct/products")
  async getProducts(@Query() dto) {
    return this.ctService.getProducts(dto);
  }

  @Get("/ct/me")
  async getMe(@Query() dto) {
    return this.ctService.me(dto);
  }

  @Post("/ct/customers/action")
  async updateCustomer(@Body() dto) {
    return this.ctService.updateCustomer(dto);
  }

  @Get("/ct/orders")
  async getOrders(@Query() dto) {
    return this.ctService.getOrders(dto);
  }

  @Get("/ct/carts")
  async getCarts(@Query() dto) {
    return this.ctService.getCarts(dto);
  }

  @Post("/ct/carts/action")
  async updateCart(@Body() dto) {
    return this.ctService.updateCart(dto);
  }
}
