import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateCartDTO, UpdateCartDTO } from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody, ResponseBodyProps } from "src/util";
import { CTApiRoot } from "../commercetools";
import {
  Cart,
  CartAddLineItemAction,
  CartChangeLineItemQuantityAction,
  CartDraft,
  CartRemoveLineItemAction,
  CartUpdate,
  CartUpdateAction,
} from "@commercetools/platform-sdk";
import { CartActions } from "src/enums";
import { CTService } from "./ct.service";

@Injectable()
export class CTCartService extends CTService {
  constructor(private readonly i18n: I18nService) {
    super();
  }

  async getCart(params: { cartId?: string }): Promise<ResponseBodyProps> {
    const { cartId } = params;
    const whereString = cartId
      ? `id="${cartId}"`
      : `customerId="${this.ctCustomer?.id}"`;

    return await CTApiRoot.carts()
      .get({
        queryArgs: {
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

  async createCart(dto: CreateCartDTO): Promise<ResponseBodyProps> {
    if (this.ctCustomer) {
      const cartDraft: CartDraft = {
        currency: "USD",
        customerId: this.ctCustomer?.id,
        lineItems: dto.products,
      };
      return await CTApiRoot.carts()
        .post({ body: cartDraft })
        .execute()
        .then(({ body }) =>
          ResponseBody().status(HttpStatus.OK).data(body).build(),
        )
        .catch((error) =>
          ResponseBody()
            .status(HttpStatus.NOT_FOUND)
            .message({ error })
            .build(),
        );
    }
  }

  async updateCart(dto: UpdateCartDTO): Promise<ResponseBodyProps> {
    const { actionType, lineItemId, lineItemSKU, quantity } = dto;
    let cartId = dto.cartId;
    if (!cartId) {
      const cart: Cart | undefined = await this.getCustomerActiveCart(
        this.ctCustomer?.id,
      );
      cartId = cart?.id;
    }
    const actions: CartUpdateAction[] = [];
    let action: CartUpdateAction = null;
    switch (actionType) {
      case CartActions.ADD:
        action = this.generateAddLineItemAction(lineItemSKU);
        break;
      case CartActions.REMOVE:
        action = this.generateRemoveLineItemAction(lineItemId);
        break;
      case CartActions.CHANGEQUANTITY:
        action = this.generateChangeineItemQuantityAction(lineItemId, quantity);
        break;
      default:
        break;
    }

    actions.push(action);
    return await this.updateCartLineItems(actions, cartId);
  }

  private async getCustomerActiveCart(customerId: string) {
    const whereString = `customerId="${customerId}"`;

    const result = await CTApiRoot.carts()
      .get({
        queryArgs: {
          where: whereString,
        },
      })
      .execute();

    return result?.body?.results?.[0];
  }

  private async updateCartLineItems(
    lineItemsAction: CartUpdateAction[],
    cartId: string,
  ) {
    const cartVersion = await this.getCartVersion(cartId);
    const actionBody: CartUpdate = {
      version: cartVersion,
      actions: lineItemsAction,
    };

    return await CTApiRoot.carts()
      .withId({ ID: cartId })
      .post({ body: actionBody })
      .execute()
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody().status(HttpStatus.NOT_FOUND).message({ error }).build(),
      );
  }

  private generateAddLineItemAction(lineItemSKU: string): CartUpdateAction {
    const addLineItemAction: CartAddLineItemAction = {
      action: "addLineItem",
      sku: lineItemSKU,
      quantity: 1,
    };

    return addLineItemAction;
  }

  private generateRemoveLineItemAction(lineItemId: string): CartUpdateAction {
    const removeLineItemAction: CartRemoveLineItemAction = {
      action: "removeLineItem",
      lineItemId,
    };

    return removeLineItemAction;
  }

  private generateChangeineItemQuantityAction(
    lineItemId: string,
    quantity: number,
  ): CartUpdateAction {
    const changeLineItemQuantityAction: CartChangeLineItemQuantityAction = {
      action: "changeLineItemQuantity",
      lineItemId,
      quantity,
    };

    return changeLineItemQuantityAction;
  }

  private async getCartVersion(cartId: string) {
    const cartResponse: ResponseBodyProps = await this.getCart({ cartId });
    return cartResponse?.data?.results[0]?.version;
  }
}
