import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CTCartService } from "src/services";

@Controller()
export class CTCartController {
  constructor(private readonly ctCartService: CTCartService) {}

  @Post("/ct/carts")
  async createCart(@Query() dto) {
    return this.ctCartService.createCart(dto);
  }

  @Get("/ct/carts")
  async getCarts(@Query() dto) {
    return this.ctCartService.getCarts(dto);
  }

  @Get("/ct/carts/me")
  async getMyCarts(@Query() dto) {
    return this.ctCartService.getMyCarts(dto);
  }

  @Patch("/ct/carts")
  async updateCart(@Body() dto) {
    return this.ctCartService.updateCart(dto);
  }

  @Delete("/ct/carts")
  async deleteCart(@Query() dto) {
    return this.ctCartService.deleteCart(dto);
  }
}
