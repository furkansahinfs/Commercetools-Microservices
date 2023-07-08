import { HttpStatus, Injectable } from "@nestjs/common";
import { GetCustomersFilterDTO } from "src/dto";
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
      ? `id="${dto.customerId}"`
      : dto?.customerNumber
      ? `customerNumber="${dto.customerNumber}"`
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
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody().status(HttpStatus.NOT_FOUND).message({ error }).build(),
      );
  }

  async getMe(): Promise<ResponseBodyProps> {
    return await CTApiRoot.customers()
      .withId({ ID: this.ctCustomer?.id })
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

  async createCustomer(email: string, customerNumber: string) {
    const customerDraft: CustomerDraft = {
      email,
      customerNumber,
      password: "pwd",
    };
    return await CTApiRoot.customers().post({ body: customerDraft }).execute();
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
}
