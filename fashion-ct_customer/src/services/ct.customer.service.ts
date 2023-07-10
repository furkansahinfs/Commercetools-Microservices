import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateCustomerDTO, GetCustomersFilterDTO } from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody, ResponseBodyProps } from "src/util";
import { CTApiRoot } from "../commercetools";
import { Customer, CustomerDraft } from "@commercetools/platform-sdk";
import { CTService } from "./ct.service";

@Injectable()
export class CTCustomerService extends CTService {
  constructor(private readonly i18n: I18nService) {
    super();
  }

  async getCustomers(dto: GetCustomersFilterDTO): Promise<ResponseBodyProps> {
    const whereString = dto?.customerId
      ? this.getWhereString({ customerIdParam: dto.customerId })
      : dto?.customerNumber
      ? this.getWhereString({ customerNumberParam: dto.customerNumber })
      : undefined;

    return await CTApiRoot.customers()
      .get({
        queryArgs: {
          limit: dto?.limit ? parseInt(dto.limit) : undefined,
          offset: dto?.offset ? parseInt(dto.offset) : undefined,
          where: whereString,
        },
      })
      .execute()
      .then(({ body }) =>
        ResponseBody()
          .status(HttpStatus.OK)
          .data({ total: body.total, results: body.results })
          .build(),
      )
      .catch((error) =>
        ResponseBody().status(HttpStatus.NOT_FOUND).message({ error }).build(),
      );
  }

  async getMe(): Promise<ResponseBodyProps> {
    return await CTApiRoot.customers()
      .withId({ ID: this.customerId })
      .get()
      .execute()
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(HttpStatus.NOT_FOUND)
          .message({ error: error?.body?.message })
          .build(),
      );
  }

  async createCustomer(dto: CreateCustomerDTO) {
    const customerDraft: CustomerDraft = dto;

    return await CTApiRoot.customers()
      .post({ body: customerDraft })
      .execute()
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(HttpStatus.BAD_REQUEST)
          .message({ error: error?.body?.message })
          .build(),
      );
  }

  async findCustomerByCustomerNumber(
    customerNumber: string,
  ): Promise<Customer> {
    const whereString = `customerNumber="${customerNumber}"`;

    const result = await CTApiRoot.customers()
      .get({
        queryArgs: {
          where: whereString,
        },
      })
      .execute();

    return result?.body?.results?.[0];
  }

  async findCustomerByCustomerId(customerId: string): Promise<Customer> {
    const whereString = `id="${customerId}"`;

    const result = await CTApiRoot.customers()
      .get({
        queryArgs: {
          where: whereString,
        },
      })
      .execute();

    return result?.body?.results?.[0];
  }

  private getWhereString(whereParams: {
    customerIdParam?: string;
    customerNumberParam?: string;
  }) {
    const { customerIdParam, customerNumberParam } = whereParams;

    if (customerIdParam) {
      const predicateIds = customerIdParam.split(",");
      return predicateIds?.length > 1
        ? `id in (${this.createWhereStringForInPredicate(predicateIds)})`
        : `id="${customerIdParam}"`;
    }

    if (customerNumberParam) {
      const predicateCustomerNumbers = customerNumberParam.split(",");
      return predicateCustomerNumbers?.length > 1
        ? `customerNumber in (${this.createWhereStringForInPredicate(
            predicateCustomerNumbers,
          )})`
        : `customerNumber="${customerIdParam}"`;
    }

    return undefined;
  }
}
