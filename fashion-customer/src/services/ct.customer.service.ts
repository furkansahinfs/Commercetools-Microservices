import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateCustomerDTO,
  GetCustomersFilterDTO,
  UpdateCustomerDTO,
} from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody, ResponseBodyProps } from "src/util";
import {
  AddressDraft,
  Customer,
  CustomerAddAddressAction,
  CustomerDraft,
  CustomerSetDefaultBillingAddressAction,
  CustomerSetDefaultShippingAddressAction,
} from "@commercetools/platform-sdk";
import { CTService } from "./ct.service";
import { CustomerActions } from "src/enums/customerAction.enum";
import { CTCustomerSDK } from "src/commercetools";

@Injectable()
export class CTCustomerService extends CTService {
  CTCustomerSDK: CTCustomerSDK;
  constructor(private readonly i18n: I18nService) {
    super();
    this.CTCustomerSDK = new CTCustomerSDK();
  }

  async getCustomers(dto: GetCustomersFilterDTO): Promise<ResponseBodyProps> {
    const where = dto?.customerId
      ? this.getWhereString({ customerIdParam: dto.customerId })
      : dto?.customerNumber
      ? this.getWhereString({ customerNumberParam: dto.customerNumber })
      : undefined;

    return await this.CTCustomerSDK.findCustomers({
      where,
      limit: undefined,
      offset: undefined,
    })
      .then(({ body }) =>
        ResponseBody()
          .status(HttpStatus.OK)
          .data({ total: body.total, results: body.results })
          .build(),
      )
      .catch((error) =>
        ResponseBody().status(error?.statusCode).message({ error }).build(),
      );
  }

  async getMe(): Promise<ResponseBodyProps> {
    const customer = await this.CTCustomerSDK.findCustomerById(this.customerId);
    if (customer) {
      return ResponseBody().status(HttpStatus.OK).data(customer).build();
    }
    return ResponseBody()
      .status(HttpStatus.NOT_FOUND)
      .message({ error: this.i18n.t("customer.customer_not_found") })
      .build();
  }

  async createCustomer(dto: CreateCustomerDTO) {
    const customerDraft: CustomerDraft = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      customerNumber: dto.customerNumber,
    };

    return await this.CTCustomerSDK.createCustomer(customerDraft)
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

  async updateCustomer(dto: UpdateCustomerDTO) {
    switch (dto.actionType) {
      case CustomerActions.SET_SHIPPING_ADDRESS:
        return await this.setAddress(dto.actionData, "SHIPPING", true);
      case CustomerActions.SET_BILLING_ADDRESS:
        return await this.setAddress(dto.actionData, "BILLING", true);
      default:
        break;
    }
  }

  private async setAddress(
    address: AddressDraft,
    type: "SHIPPING" | "BILLING",
    overrideDefault?: boolean,
  ) {
    const addAdressAction: CustomerAddAddressAction = {
      address: address,
      action: "addAddress",
    };

    const updatedCustomerResponse: Customer =
      await this.CTCustomerSDK.updateCustomer(this.customerId, [
        addAdressAction,
      ])
        .then(({ body }) => body)
        .catch((error) =>
          ResponseBody()
            .status(HttpStatus.BAD_REQUEST)
            .message({ error: error?.body?.message })
            .build(),
        );

    if (!updatedCustomerResponse?.id) {
      return updatedCustomerResponse;
    }

    const updatedCustomer = updatedCustomerResponse;

    if (!overrideDefault) {
      return updatedCustomer;
    }

    const setDefaultAddressAction:
      | CustomerSetDefaultShippingAddressAction
      | CustomerSetDefaultBillingAddressAction = {
      addressId: updatedCustomer.addresses?.[0]?.id,
      action:
        type === "SHIPPING"
          ? "setDefaultShippingAddress"
          : "setDefaultBillingAddress",
    };

    return await this.CTCustomerSDK.updateCustomer(this.customerId, [
      setDefaultAddressAction,
    ])
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
