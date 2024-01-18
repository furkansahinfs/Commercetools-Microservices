import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateOrderDTO, GetOrdersFilterDTO } from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody } from "src/util";
import { CTOrderSDK } from "../commercetools";
import { CTService } from "./ct.service";
import { generateWhereString } from "./utils";

@Injectable()
export class CTOrderService extends CTService {
  CTOrderSDK: CTOrderSDK;
  constructor(private readonly i18n: I18nService) {
    super();
    this.CTOrderSDK = new CTOrderSDK();
  }

  async getOrders(dto: GetOrdersFilterDTO) {
    const where = dto?.orderId
      ? generateWhereString({ orderIdParam: dto.orderId })
      : dto?.orderNumber
      ? generateWhereString({ orderNumberParam: dto.orderNumber })
      : undefined;

    return await this.CTOrderSDK.findOrders({
      where,
      limit: this.getLimit(dto?.limit),
      offset: this.getOffset(dto?.offset),
    })
      .then(({ body }) =>
        ResponseBody()
          .status(HttpStatus.OK)
          .data({ total: body.total, results: body.results })
          .build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(error?.statusCode)
          .message({
            error,
            id: dto.orderId,
          })
          .build(),
      );
  }

  async getMyOrders(dto: GetOrdersFilterDTO) {
    const where = `customerId="${this.customerId}"`;

    return await this.CTOrderSDK.findMyOrders({
      where,
      limit: this.getLimit(),
      offset: this.getOffset(),
    })
      .then(({ body }) =>
        ResponseBody()
          .status(HttpStatus.OK)
          .data({ total: body.total, results: body.results })
          .build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(error?.statusCode)
          .message({
            error,
            id: dto.orderId,
          })
          .build(),
      );
  }

  async getOrderWithId(orderId: string) {
    return await this.CTOrderSDK.findOrderById(orderId)
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(error?.statusCode)
          .message({ error, id: orderId })
          .build(),
      );
  }

  async createOrder(dto: CreateOrderDTO) {
    try {
      const existingCart = await this.CTOrderSDK.findCartById(
        dto.cartId,
        this.customerId,
      );

      if (existingCart?.id) {
        return await this.CTOrderSDK.createOrder(existingCart)
          .then(({ body }) =>
            ResponseBody().status(HttpStatus.OK).data(body).build(),
          )
          .catch((error) =>
            ResponseBody()
              .status(error?.statusCode)
              .message({ error, id: dto.cartId })
              .build(),
          );
      }
      return ResponseBody()
        .status(HttpStatus.NOT_FOUND)
        .message({
          error: this.i18n.translate("order.order.cart_not_found"),
          id: dto.cartId,
        })
        .build();
    } catch (error) {
      return ResponseBody()
        .status(error?.statusCode)
        .message({ error, id: dto.cartId })
        .build();
    }
  }
}
