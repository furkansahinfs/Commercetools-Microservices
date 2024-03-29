import { Controller, UseGuards } from "@nestjs/common";
import { OrderService } from "src/services";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { MessagePattern } from "@nestjs/microservices";
import { ROLES } from "src/enums";
import { CreateOrderPayload, GetOrdersFilterPayload } from "src/dto";
import { IResponse, QueryData } from "src/types";
import { Order } from "@commercetools/platform-sdk";

@Controller()
export class OrderController {
  constructor(protected readonly orderService: OrderService) {}

  @MessagePattern({ role: "orders", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getOrders(
    payload: GetOrdersFilterPayload,
  ): Promise<IResponse<QueryData<Order>>> {
    this.orderService.setCTCustomer(payload.user.ct_customer_id);
    return this.orderService.getOrders(payload.dto);
  }

  @MessagePattern({ role: "orders/me", cmd: "get" })
  async getMyOrders(
    payload: GetOrdersFilterPayload,
  ): Promise<IResponse<QueryData<Order>>> {
    this.orderService.setCTCustomer(payload.user.ct_customer_id);
    return this.orderService.getMyOrders(payload.dto);
  }

  @MessagePattern({ role: "orders", cmd: "post" })
  async createOrder(payload: CreateOrderPayload): Promise<IResponse<Order>> {
    this.orderService.setCTCustomer(payload.user.ct_customer_id);
    return this.orderService.createOrder(payload.dto);
  }
}
