import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { CTService } from "src/services";

/** DTO validated in services */

@Controller("customers")
export class CTCustomerController {
  private path = "customers";
  constructor(private readonly ctService: CTService) {}

  @Get()
  async getCustomers(@Query() dto) {
    return this.ctService.send(this.path, "get", dto);
  }

  @Get("/me")
  async getMe(@Query() dto) {
    return this.ctService.send(this.path, "get/me", dto);
  }

  @Post("/new")
  async createCustomer(@Body() dto) {
    return this.ctService.send(this.path, "post/new", dto);
  }

  @Post("/action")
  async updateCustomer(@Body() dto) {
    return this.ctService.send(this.path, "post/action", dto);
  }

  @Delete()
  async deleteCustomer(@Query() dto) {
    return this.ctService.send(this.path, "delete", dto);
  }
}
