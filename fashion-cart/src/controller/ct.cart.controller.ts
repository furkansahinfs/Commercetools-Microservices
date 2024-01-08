import { Controller, UseGuards } from "@nestjs/common";
import { CreateCartDTO, GetCartFilterDTO, UpdateCartDTO } from "src/dto";
import { CTCartService } from "src/services";
import { ROLES } from "src/enums/roles.enum";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { MessagePattern } from "@nestjs/microservices";
import { Payload } from "src/dto/payload";

@Controller()
export class CTCartController {
  constructor(protected readonly ctCartService: CTCartService) {}

  @MessagePattern({ role: "carts", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getCarts(payload: Payload<GetCartFilterDTO>) {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctCartService.getCarts({ cartId: payload.dto.cartId });
  }

  @MessagePattern({ role: "carts", cmd: "get-me" })
  @UseGuards(RolesGuard)
  async getMyActiveCart(payload: Payload<GetCartFilterDTO>) {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctCartService.getCustomerActiveCart(
      payload.user.ct_customer_id,
    );
  }

  @MessagePattern({ role: "carts", cmd: "post" })
  async createCart(payload: Payload<CreateCartDTO>) {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctCartService.createCart(payload.dto);
  }

  @MessagePattern({ role: "carts", cmd: "patch" })
  async updateCart(payload: Payload<UpdateCartDTO>) {
    this.ctCartService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctCartService.updateCart(payload.dto);
  }
}
