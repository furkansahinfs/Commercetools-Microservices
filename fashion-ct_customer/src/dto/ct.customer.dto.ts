import { IsNotEmpty, IsNumberString, IsOptional } from "class-validator";

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
