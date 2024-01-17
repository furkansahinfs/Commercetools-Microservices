import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CTCustomerService } from "src/services";

/** DTO validated in services */

@Controller("customers")
export class CTCustomerController {
  constructor(private readonly ctCustomerService: CTCustomerService) {}

  @Get("/me")
  async getMe(@Query() dto) {
    return this.ctCustomerService.me(dto);
  }

  @Get()
  async getCustomers(@Query() dto) {
    return this.ctCustomerService.getCustomers(dto);
  }

  @Post("/new")
  async createCustomer(@Body() dto) {
    return this.ctCustomerService.createCustomer(dto);
  }

  @Patch()
  async updateCustomer(@Body() dto) {
    return this.ctCustomerService.updateCustomer(dto);
  }

  @Delete()
  async deleteCustomer(@Query() dto) {
    return this.ctCustomerService.deleteCustomer(dto);
  }
}
