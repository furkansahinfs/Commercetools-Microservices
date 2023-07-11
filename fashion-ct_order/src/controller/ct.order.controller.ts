import { Controller, UseGuards } from "@nestjs/common";
import { GetOrdersFilterDTO } from "src/dto";
import { CTOrderService } from "src/services";
import { CTController } from "./ct.controller";
import { Roles } from "src/util";
import { ROLES } from "src/enums/roles.enum";
import { RolesGuard } from "src/middleware";
import { MessagePattern } from "@nestjs/microservices";
import { Payload } from "src/dto/payload";

@Controller()
export class CTOrderController extends CTController {
  constructor(protected readonly ctOrderService: CTOrderService) {
    super(undefined, ctOrderService);
  }

  @MessagePattern({ role: "/ct/orders", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getOrders(payload: Payload<GetOrdersFilterDTO>) {
    return await this.ctOrderService.getOrders(payload.dto);
  }

  @MessagePattern({ role: "/ct/orders", cmd: "get-my-orders" })
  async getMyOrders(payload: Payload<GetOrdersFilterDTO>) {
    return await this.ctOrderService.getMyOrders(payload.dto);
  }
}
