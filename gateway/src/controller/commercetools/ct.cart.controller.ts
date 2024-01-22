import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { CTService } from "src/services";

/** DTO validated in services */

@Controller("carts")
export class CTCartController {
  private path = "carts";
  constructor(private readonly ctService: CTService) {}

  @Post()
  async createCart(@Query() dto) {
    return this.ctService.send(this.path, "post", dto);
  }

  @Get()
  async getCarts(@Query() dto) {
    return this.ctService.send(this.path, "get", dto);
  }

  @Get("/me")
  async getMyCarts(@Query() dto) {
    return this.ctService.send(this.path, "get/me", dto);
  }

  @Post("/action")
  async updateCart(@Body() dto) {
    return this.ctService.send(this.path, "post/action", dto);
  }

  @Delete()
  async deleteCart(@Query() dto) {
    return this.ctService.send(this.path, "delete", dto);
  }
}
