import { HttpStatus, Injectable } from "@nestjs/common";
import { GetOrdersFilterDTO } from "src/dto";
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
}
