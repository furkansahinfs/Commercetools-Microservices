import { Controller, UseGuards } from "@nestjs/common";

import { CTCustomerService } from "src/services";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { ROLES } from "src/enums/roles.enum";
import { MessagePattern } from "@nestjs/microservices";
import {
  CreateCustomerPayload,
  GetCustomersFilterPayload,
  UpdateCustomerPayload,
} from "src/dto";
import { Customer, CustomerSignInResult } from "@commercetools/platform-sdk";
import { IResponse } from "src/types";

@Controller()
export class CTCustomerController {
  constructor(protected readonly ctCustomerService: CTCustomerService) {}

  @MessagePattern({ role: "customers", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getCustomers(payload: GetCustomersFilterPayload): Promise<
    IResponse<{
      total: number;
      results: Customer[];
    }>
  > {
    return await this.ctCustomerService.getCustomers(payload.dto);
  }

  @MessagePattern({ role: "customers/me", cmd: "get" })
  async getMe(
    payload: GetCustomersFilterPayload,
  ): Promise<IResponse<Customer>> {
    this.ctCustomerService.setCTCustomer(payload.user?.ct_customer_id);
    return await this.ctCustomerService.getMe();
  }

  @MessagePattern({ role: "customers", cmd: "post" })
  async create(
    payload: CreateCustomerPayload,
  ): Promise<IResponse<CustomerSignInResult>> {
    return await this.ctCustomerService.createCustomer(payload.dto);
  }

  @MessagePattern({ role: "customers/action", cmd: "post" })
  async update(payload: UpdateCustomerPayload): Promise<IResponse<Customer>> {
    this.ctCustomerService.setCTCustomer(payload.user?.ct_customer_id);
    return await this.ctCustomerService.updateCustomer(payload.dto);
  }
}
