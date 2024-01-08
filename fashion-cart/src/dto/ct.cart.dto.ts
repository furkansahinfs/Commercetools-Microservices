import { AddressDraft, LineItemDraft } from "@commercetools/platform-sdk";
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from "class-validator";
import { CartActions } from "../enums";
import { User } from "src/types";
import { Payload } from "./payload";
import { Type } from "class-transformer";

export class GetCartFilterDTO {
  @IsOptional()
  cartId?: string;
}

export class GetCartFilterPayload extends Payload<GetCartFilterDTO> {
  @Type(() => GetCartFilterDTO)
  dto: GetCartFilterDTO;
  @IsNotEmpty()
  user: User;
}

export class CreateCartDTO {
  products?: LineItemDraft[];
}

export class CreateCartPayload extends Payload<CreateCartDTO> {
  @Type(() => CreateCartDTO)
  dto: CreateCartDTO;
  @IsNotEmpty()
  user: User;
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

  getType() {
    return UpdateCartDTO;
  }
}

export class UpdateCartPayload extends Payload<UpdateCartDTO> {
  @Type(() => UpdateCartDTO)
  dto: UpdateCartDTO;
  @IsNotEmpty()
  user: User;
}
