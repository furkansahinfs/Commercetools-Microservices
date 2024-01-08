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

@Controller()
export class CTCustomerController {
  constructor(private readonly ctCustomerService: CTCustomerService) {}

  @Get("/ct/customers/me")
  async getMe(@Query() dto) {
    return this.ctCustomerService.me(dto);
  }

  @Get("/ct/customers")
  async getCustomers(@Query() dto) {
    return this.ctCustomerService.getCustomers(dto);
  }

  @Post("/ct/customers")
  async createCustomer(@Body() dto) {
    return this.ctCustomerService.createCustomer(dto);
  }

  @Patch("/ct/customers")
  async updateCart(@Body() dto) {
    return this.ctCustomerService.updateCustomer(dto);
  }

  @Delete("/ct/customers")
  async deleteCart(@Query() dto) {
    return this.ctCustomerService.deleteCustomer(dto);
  }
}
