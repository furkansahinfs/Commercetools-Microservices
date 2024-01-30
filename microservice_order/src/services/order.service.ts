import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateOrderDTO, GetOrdersFilterDTO } from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody } from "src/util";
import { Service } from "./service";
import { generateWhereString } from "./utils";
import { IResponse, QueryData } from "src/types";
import { Cart, Order } from "@commercetools/platform-sdk";
import { CTOrderSDKImpl } from "src/repository";

@Injectable()
export class OrderService extends Service {
  ctOrderSDKImpl: CTOrderSDKImpl;
  constructor(private readonly i18n: I18nService) {
    super();
    this.ctOrderSDKImpl = new CTOrderSDKImpl();
  }

  async getOrders(
    dto: GetOrdersFilterDTO,
  ): Promise<IResponse<QueryData<Order>>> {
    const where = dto?.orderId
      ? generateWhereString({ orderIdParam: dto.orderId })
      : dto?.orderNumber
      ? generateWhereString({ orderNumberParam: dto.orderNumber })
      : undefined;

    return this.ctOrderSDKImpl
      .findOrders({
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

  async getMyOrders(
    dto: GetOrdersFilterDTO,
  ): Promise<IResponse<QueryData<Order>>> {
    const where = `customerId="${this.customerId}"`;

    return this.ctOrderSDKImpl
      .findMyOrders({
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

  async getOrderWithId(orderId: string): Promise<IResponse<Order>> {
    return this.ctOrderSDKImpl
      .findOrderById(orderId)
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

  async createOrder(dto: CreateOrderDTO): Promise<IResponse<Order>> {
    try {
      const existingCart: Cart | undefined =
        await this.ctOrderSDKImpl.findCartById(dto.cartId, this.customerId);

      if (existingCart?.id) {
        return await this.ctOrderSDKImpl
          .createOrder(existingCart)
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
