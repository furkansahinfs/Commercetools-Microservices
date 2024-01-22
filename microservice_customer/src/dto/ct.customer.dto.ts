import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";
import { CustomerActions } from "src/enums/customerAction.enum";
import { User } from "src/types";
import { Payload } from "./payload";

export class CreateCustomerDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  customerNumber?: string;
}

export class CreateCustomerPayload extends Payload<CreateCustomerDTO> {
  @Type(() => CreateCustomerDTO)
  dto: CreateCustomerDTO;
  user: User;
}

export class GetCustomersFilterDTO {
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  offset?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  customerNumber?: string;
}

export class GetCustomersFilterPayload extends Payload<GetCustomersFilterDTO> {
  @Type(() => GetCustomersFilterDTO)
  dto: GetCustomersFilterDTO;
  @IsNotEmpty()
  user: User;
}

export class UpdateCustomerDTO {
  @IsNotEmpty()
  @IsEnum(CustomerActions)
  @IsString()
  actionType: string;

  @ValidateIf(
    (o) =>
      o.actionType === CustomerActions.SET_SHIPPING_ADDRESS ||
      o.actionType === CustomerActions.SET_BILLING_ADDRESS,
  )
  @IsNotEmpty()
  address: any;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  customerNumber?: string;
}

export class UpdateCustomerPayload extends Payload<UpdateCustomerDTO> {
  @Type(() => UpdateCustomerDTO)
  dto: UpdateCustomerDTO;
  user: User;
}
