import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from "class-validator";
import { CustomerActions } from "src/enums/customerAction.enum";
import { User } from "src/types";
import { Payload } from "./payload";

export class CreateCustomerDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
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
  customerId?: string;

  @IsOptional()
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
  actionType: string;

  @IsNotEmpty()
  actionData: any;

  @IsOptional()
  customerId?: string;

  @IsOptional()
  customerNumber?: string;
}

export class UpdateCustomerPayload extends Payload<UpdateCustomerDTO> {
  @Type(() => UpdateCustomerDTO)
  dto: UpdateCustomerDTO;
  user: User;
}
