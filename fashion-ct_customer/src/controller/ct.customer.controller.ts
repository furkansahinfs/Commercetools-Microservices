import { Controller, Query, UseGuards } from "@nestjs/common";
import { GetCustomersFilterDTO, Payload } from "src/dto";
import { CTCustomerService } from "src/services";

import { CTController } from "./ct.controller";
import { Roles } from "src/util";
import { RoleGuard } from "src/middleware";
import { ROLES } from "src/enums/roles.enum";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class CTCustomerController extends CTController {
  constructor(protected readonly ctCustomerService: CTCustomerService) {
    super(ctCustomerService);
  }

  @MessagePattern({ role: "/ct/customers", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RoleGuard)
  async getCustomers(payload: Payload<GetCustomersFilterDTO>) {
    return await this.ctCustomerService.getCustomers(payload.dto);
  }

  @MessagePattern({ role: "/ct/customers", cmd: "get-me" })
  async getMe(payload: Payload<GetCustomersFilterDTO>) {
    return await this.ctCustomerService.getMe();
  }
}
