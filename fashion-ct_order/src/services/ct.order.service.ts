import { HttpStatus, Injectable } from "@nestjs/common";
import { GetOrdersFilterDTO } from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody } from "src/util";
import { CTApiRoot } from "../commercetools/";
import { CTService } from "./ct.service";

@Injectable()
export class CTOrderService extends CTService {
  constructor(private readonly i18n: I18nService) {
    super();
  }

  async getOrders(dto: GetOrdersFilterDTO) {
    if (dto?.orderId) {
      return await this.getOrderWithId(dto.orderId);
    }

    return await CTApiRoot.orders()
      .get({
        queryArgs: {
          limit: dto?.limit ? parseInt(dto.limit) : undefined,
          offset: dto?.offset ? parseInt(dto.offset) : undefined,
        },
      })
      .execute()
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(HttpStatus.NOT_FOUND)
          .message({
            error,
            id: dto.orderId,
          })
          .build(),
      );
  }

  async getMyOrders(dto: GetOrdersFilterDTO) {
    const whereString = `customerId="${this.ctCustomer?.id}"`;
    return await CTApiRoot.orders()
      .get({
        queryArgs: {
          limit: dto?.limit ? parseInt(dto.limit) : undefined,
          offset: dto?.offset ? parseInt(dto.offset) : undefined,
          where: whereString,
        },
      })
      .execute()
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(HttpStatus.NOT_FOUND)
          .message({
            error,
            id: dto.orderId,
          })
          .build(),
      );
  }

  async getOrderWithId(orderId: string) {
    return await CTApiRoot.orders()
      .withId({ ID: orderId })
      .get()
      .execute()
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(HttpStatus.NOT_FOUND)
          .message({ error, id: orderId })
          .build(),
      );
  }
}
