import { AddressDraft, LineItemDraft } from "@commercetools/platform-sdk";
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from "class-validator";
import { CartActions } from "../enums";

export class GetCartFilterDTO {
  @IsOptional()
  cartId?: string;
}

export class CreateCartDTO {
  products?: LineItemDraft[];
}

export class UpdateCartDTO {
  @IsNotEmpty()
  @IsEnum(CartActions)
  actionType: string;

  @ValidateIf(
    (o) =>
      o.actionType === CartActions.CHANGEQUANTITY ||
      o.actionType === CartActions.REMOVE,
  )
  @IsNotEmpty()
  lineItemId: string;

  @ValidateIf((o) => o.actionType === CartActions.ADD)
  @IsNotEmpty()
  lineItemSKU: string;

  @IsOptional()
  cartId: string;

  @ValidateIf((o) => o.actionType === CartActions.CHANGEQUANTITY)
  @IsNotEmpty()
  quantity: number;

  @ValidateIf(
    (o) =>
      o.actionType === CartActions.SET_BILLING_ADDRESS ||
      o.actionType === CartActions.SET_SHIPPING_ADDRESS,
  )
  @IsNotEmpty()
  address: AddressDraft;
}
