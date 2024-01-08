import { IsNotEmpty, ValidateNested } from "class-validator";

export abstract class Payload<T> {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  abstract dto: T;
}
