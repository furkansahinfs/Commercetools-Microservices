import { Controller, UseGuards } from "@nestjs/common";
import { CreateCartDTO, GetCartFilterDTO, UpdateCartDTO } from "src/dto";
import { CTCartService } from "src/services";
import { CTController } from "./ct.controller";
import { ROLES } from "src/enums/roles.enum";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { MessagePattern } from "@nestjs/microservices";
import { Payload } from "src/dto/payload";

@Controller()
export class CTCartController extends CTController {
  constructor(protected readonly ctCartService: CTCartService) {
    super(ctCartService, undefined);
  }

  @MessagePattern({ role: "/ct/carts", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getCarts(payload: Payload<GetCartFilterDTO>) {
    await this.ctCartService.getCart({ cartId: payload.dto.cartId });
  }

  @MessagePattern({ role: "/ct/carts", cmd: "create" })
  async createCart(payload: Payload<CreateCartDTO>) {
    return await this.ctCartService.createCart(payload.dto);
  }

  @MessagePattern({ role: "/ct/carts", cmd: "update" })
  async updateCart(payload: Payload<UpdateCartDTO>) {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctCartService.updateCart(payload.dto);
  }
}
