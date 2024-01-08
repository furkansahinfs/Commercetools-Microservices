import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateCartDTO, UpdateCartDTO } from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody } from "src/util";
import { CTCartSDK } from "../commercetools";
import {
  AddressDraft,
  Cart,
  CartAddLineItemAction,
  CartChangeLineItemQuantityAction,
  CartDraft,
  CartRemoveLineItemAction,
  CartSetBillingAddressAction,
  CartSetShippingAddressAction,
  CartUpdateAction,
} from "@commercetools/platform-sdk";
import { CartActions } from "src/enums";
import { CTService } from "./ct.service";
import { IResponse } from "src/types";

@Injectable()
export class CTCartService extends CTService {
  CTCartSDK: CTCartSDK;
  constructor(private readonly i18n: I18nService) {
    super();
    this.CTCartSDK = new CTCartSDK();
  }

  async getCarts(params: { cartId?: string }): Promise<IResponse> {
    const { cartId } = params;
    const whereString = cartId
      ? `id="${cartId}"`
      : `customerId="${this.customerId}"`;

    return await this.CTCartSDK.findCarts({
      where: whereString,
      limit: undefined,
      offset: undefined,
    })
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody().status(error?.statusCode).message({ error }).build(),
      );
  }

  async createCart(dto: CreateCartDTO): Promise<IResponse> {
    if (this.customerId) {
      const cartDraft: CartDraft = {
        currency: "USD",
        customerId: this.customerId,
        lineItems: dto.products,
      };
      return await this.CTCartSDK.createCart(cartDraft)
        .then(({ body }) =>
          ResponseBody().status(HttpStatus.OK).data(body).build(),
        )
        .catch((error) =>
          ResponseBody().status(error?.statusCode).message({ error }).build(),
        );
    }
  }

  async updateCart(dto: UpdateCartDTO): Promise<IResponse> {
    const { actionType, lineItemId, lineItemSKU, quantity, address } = dto;
    let cartId = dto.cartId;
    if (!cartId) {
      const cart: Cart | undefined = await this.getCustomerActiveCart(
        this.customerId,
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
      case CartActions.SET_SHIPPING_ADDRESS:
        action = this.generateAddressAction(address, "SHIPPING");
        break;
      case CartActions.SET_BILLING_ADDRESS:
        action = this.generateAddressAction(address, "BILLING");
        break;
      default:
        break;
    }

    actions.push(action);
    return await this.updateCartWithActions(actions, cartId);
  }

  async getCustomerActiveCart(customerId: string) {
    const cart = await this.CTCartSDK.findCartByCustomerId(customerId);

    if (cart) {
      return cart;
    }

    const cartDraft: CartDraft = {
      currency: "USD",
      customerId: customerId,
      lineItems: [],
    };
    const createdCart = await this.CTCartSDK.createCart(cartDraft);
    return createdCart.body;
  }

  private async updateCartWithActions(
    lineItemsAction: CartUpdateAction[],
    cartId: string,
  ) {
    return await this.CTCartSDK.updateCart(cartId, lineItemsAction)
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody().status(error?.statusCode).message({ error }).build(),
      );
  }

  private generateAddressAction(
    address: AddressDraft,
    type: "SHIPPING" | "BILLING",
  ) {
    const setAdressAction:
      | CartSetShippingAddressAction
      | CartSetBillingAddressAction = {
      address: address,
      action: type === "SHIPPING" ? "setShippingAddress" : "setBillingAddress",
    };

    return setAdressAction;
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
}
