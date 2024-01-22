import { Controller, UseGuards } from "@nestjs/common";
import { CTOrderService } from "src/services";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { MessagePattern } from "@nestjs/microservices";
import { ROLES } from "src/enums";
import { CreateOrderPayload, GetOrdersFilterPayload } from "src/dto";
import { IResponse, QueryData } from "src/types";
import { Order } from "@commercetools/platform-sdk";

@Controller()
export class CTOrderController {
  constructor(protected readonly ctOrderService: CTOrderService) {}

  @MessagePattern({ role: "orders", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getOrders(
    payload: GetOrdersFilterPayload,
  ): Promise<IResponse<QueryData<Order>>> {
    this.ctOrderService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctOrderService.getOrders(payload.dto);
  }

  @MessagePattern({ role: "orders/me", cmd: "get" })
  async getMyOrders(
    payload: GetOrdersFilterPayload,
  ): Promise<IResponse<QueryData<Order>>> {
    this.ctOrderService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctOrderService.getMyOrders(payload.dto);
  }

  @MessagePattern({ role: "orders", cmd: "post" })
  async createOrder(payload: CreateOrderPayload): Promise<IResponse<Order>> {
    this.ctOrderService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctOrderService.createOrder(payload.dto);
  }
}
