import { Controller, UseGuards } from "@nestjs/common";
import { CustomerService } from "src/services";
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
import { IResponse, QueryData } from "src/types";

@Controller()
export class CustomerController {
  constructor(protected readonly customerService: CustomerService) {}

  @MessagePattern({ role: "customers", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getCustomers(
    payload: GetCustomersFilterPayload,
  ): Promise<IResponse<QueryData<Customer>>> {
    return this.customerService.getCustomers(payload.dto);
  }

  @MessagePattern({ role: "customers/me", cmd: "get" })
  async getMe(
    payload: GetCustomersFilterPayload,
  ): Promise<IResponse<Customer>> {
    this.customerService.setCTCustomer(payload.user?.ct_customer_id);
    return this.customerService.getMe();
  }

  @MessagePattern({ role: "customers", cmd: "post" })
  async create(
    payload: CreateCustomerPayload,
  ): Promise<IResponse<CustomerSignInResult>> {
    return this.customerService.createCustomer(payload.dto);
  }

  @MessagePattern({ role: "customers/action", cmd: "post" })
  async update(payload: UpdateCustomerPayload): Promise<IResponse<Customer>> {
    this.customerService.setCTCustomer(payload.user?.ct_customer_id);
    return this.customerService.updateCustomer(payload.dto);
  }
}
