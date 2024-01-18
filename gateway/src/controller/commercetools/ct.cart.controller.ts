import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { CTCartService } from "src/services";

/** DTO validated in services */

@Controller("carts")
export class CTCartController {
  constructor(private readonly ctCartService: CTCartService) {}

  @Post()
  async createCart(@Query() dto) {
    return this.ctCartService.createCart(dto);
  }

  @Get()
  async getCarts(@Query() dto) {
    return this.ctCartService.getCarts(dto);
  }

  @Get("/me")
  async getMyCarts(@Query() dto) {
    return this.ctCartService.getMyCarts(dto);
  }

  @Post("/action")
  async updateCart(@Body() dto) {
    return this.ctCartService.updateCart(dto);
  }

  @Delete()
  async deleteCart(@Query() dto) {
    return this.ctCartService.deleteCart(dto);
  }
}
