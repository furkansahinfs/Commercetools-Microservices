import { HttpStatus, Injectable } from "@nestjs/common";
import { GetProductsFilterDTO } from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody } from "src/util";
import { generateWhereIdString } from "./utils";
import { IResponse, QueryData } from "src/types";
import { Service } from "./service";
import { Product } from "@commercetools/platform-sdk";
import { CTProductSDKImpl } from "src/repository";

@Injectable()
export class ProductService extends Service {
  ctProductSDKImpl: CTProductSDKImpl;
  constructor(private readonly i18n: I18nService) {
    super();
    this.ctProductSDKImpl = new CTProductSDKImpl();
  }

  async getProducts(
    dto: GetProductsFilterDTO,
  ): Promise<IResponse<QueryData<Product>>> {
    const where = dto?.productIds
      ? generateWhereIdString(dto.productIds)
      : undefined;

    return this.ctProductSDKImpl
      .findProducts({
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
      .catch((error) => {
        return ResponseBody()
          .status(error?.statusCode)
          .message({
            error: error,
            where,
          })
          .build();
      });
  }

  async getProductWithId(productId: string): Promise<IResponse<Product>> {
    return this.ctProductSDKImpl
      .findProductById(productId)
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(error?.statusCode)
          .message({ error, id: productId })
          .build(),
      );
  }
}
