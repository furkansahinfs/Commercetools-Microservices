import { User } from "./user.dto";

export class Payload<T> {
  dto: T;
  user: User;
}
