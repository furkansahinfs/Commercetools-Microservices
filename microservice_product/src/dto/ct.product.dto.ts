import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";
import { Payload } from "./payload";
import { Type } from "class-transformer";
import { User } from "src/types";

export class GetProductsFilterDTO {
  @ValidateIf((o) => !o.productId)
  @IsNotEmpty()
  @IsNumberString()
  limit: string;

  @ValidateIf((o) => !o.productId)
  @IsNotEmpty()
  @IsNumberString()
  offset: string;

  @IsOptional()
  @IsString()
  productIds?: string;
}

export class GetProductsFilterPayload extends Payload<GetProductsFilterDTO> {
  @Type(() => GetProductsFilterDTO)
  dto: GetProductsFilterDTO;
  user: User;
}
