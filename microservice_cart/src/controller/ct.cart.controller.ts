import { Controller, UseGuards } from "@nestjs/common";
import { CTCartService } from "src/services";
import { ROLES } from "src/enums/roles.enum";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { MessagePattern } from "@nestjs/microservices";
import {
  CreateCartPayload,
  GetCartFilterPayload,
  UpdateCartPayload,
} from "src/dto";
import { IResponse } from "src/types";
import { Cart, CartPagedQueryResponse } from "@commercetools/platform-sdk";

@Controller()
export class CTCartController {
  constructor(protected readonly ctCartService: CTCartService) {}

  @MessagePattern({ role: "carts", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getCarts(
    payload: GetCartFilterPayload,
  ): Promise<IResponse<CartPagedQueryResponse>> {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return this.ctCartService.getCarts({ cartId: payload.dto.cartId });
  }

  @MessagePattern({ role: "carts/me", cmd: "get" })
  async getMyActiveCart(
    payload: GetCartFilterPayload,
  ): Promise<IResponse<Cart>> {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return this.ctCartService.getCustomerActiveCart();
  }

  @MessagePattern({ role: "carts", cmd: "post" })
  async createCart(payload: CreateCartPayload): Promise<IResponse<Cart>> {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return this.ctCartService.createCart(payload.dto);
  }

  @MessagePattern({ role: "carts/action", cmd: "post" })
  async updateCart(payload: UpdateCartPayload): Promise<IResponse<Cart>> {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return this.ctCartService.updateCart(payload.dto);
  }
}
