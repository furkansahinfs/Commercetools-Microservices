import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";
import { User } from "src/types";
import { Payload } from "./payload";
import { Type } from "class-transformer";

export class GetOrdersFilterDTO {
  @ValidateIf((o) => !o.orderId)
  @IsNotEmpty()
  @IsNumberString()
  limit: string;

  @ValidateIf((o) => !o.orderId)
  @IsNotEmpty()
  @IsNumberString()
  offset: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  orderNumber?: string;
}

export class GetOrdersFilterPayload extends Payload<GetOrdersFilterDTO> {
  @Type(() => GetOrdersFilterDTO)
  dto: GetOrdersFilterDTO;
  @IsNotEmpty()
  user: User;
}

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsString()
  cartId?: string;
}

export class CreateOrderPayload extends Payload<CreateOrderDTO> {
  @Type(() => CreateOrderDTO)
  dto: CreateOrderDTO;
  @IsNotEmpty()
  user: User;
}
