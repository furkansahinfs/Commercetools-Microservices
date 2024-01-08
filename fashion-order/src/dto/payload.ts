import { User } from "src/types/user";

export class Payload<T> {
  dto: T;
  user: User;
}
