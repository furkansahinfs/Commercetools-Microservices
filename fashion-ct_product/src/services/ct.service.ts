import { Customer } from "@commercetools/platform-sdk";

export class CTService {
  protected ctCustomer: Customer;

  public setCTCustomer(ctCustomer: Customer | undefined) {
    this.ctCustomer = ctCustomer;
  }
}
