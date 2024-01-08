import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateIf,
} from "class-validator";

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
  productIds?: string;
}
