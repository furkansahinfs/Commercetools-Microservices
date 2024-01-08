import { Controller, UseGuards } from "@nestjs/common";
import { GetOrdersFilterDTO, Payload } from "src/dto";
import { CTOrderService } from "src/services";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { MessagePattern } from "@nestjs/microservices";
import { ROLES } from "src/enums";

@Controller()
export class CTOrderController {
  constructor(protected readonly ctOrderService: CTOrderService) {}

  @MessagePattern({ role: "orders", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getOrders(payload: Payload<GetOrdersFilterDTO>) {
    return await this.ctOrderService.getOrders(payload.dto);
  }

  @MessagePattern({ role: "orders", cmd: "get-me" })
  async getMyOrders(payload: Payload<GetOrdersFilterDTO>) {
    return await this.ctOrderService.getMyOrders(payload.dto);
  }
}
