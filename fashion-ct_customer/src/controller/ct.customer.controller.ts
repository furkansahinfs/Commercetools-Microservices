import { Controller, UseGuards } from "@nestjs/common";
import {
  CreateCustomerDTO,
  GetCustomersFilterDTO,
  Payload,
  UpdateCustomerDTO,
} from "src/dto";
import { CTCustomerService } from "src/services";
import { CTController } from "./ct.controller";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { ROLES } from "src/enums/roles.enum";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class CTCustomerController extends CTController {
  constructor(protected readonly ctCustomerService: CTCustomerService) {
    super(ctCustomerService);
  }

  @MessagePattern({ role: "/ct/customers", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getCustomers(payload: Payload<GetCustomersFilterDTO>) {
    return await this.ctCustomerService.getCustomers(payload.dto);
  }

  @MessagePattern({ role: "/ct/customers", cmd: "me" })
  async getMe(payload: Payload<GetCustomersFilterDTO>) {
    this.ctCustomerService.setCTCustomer(payload.user?.ct_customer_id);
    return await this.ctCustomerService.getMe();
  }

  @MessagePattern({ role: "/ct/customers", cmd: "create" })
  async create(payload: Payload<CreateCustomerDTO>) {
    return await this.ctCustomerService.createCustomer(payload.dto);
  }

  @MessagePattern({ role: "/ct/customers", cmd: "update" })
  async update(payload: Payload<UpdateCustomerDTO>) {
    this.ctCustomerService.setCTCustomer(payload.user?.ct_customer_id);
    return await this.ctCustomerService.updateCustomer(payload.dto);
  }
}
