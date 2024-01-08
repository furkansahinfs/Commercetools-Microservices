import { User } from "src/types";

export class Payload<T> {
  dto: T;
  user: User;
}
