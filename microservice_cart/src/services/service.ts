export class Service {
  protected customerId: string;

  public setCTCustomer(customerId: string) {
    this.customerId = customerId;
  }

  public getLimit(limit?: string): number | undefined {
    return limit ? parseInt(limit) : undefined;
  }

  public getOffset(offset?: string): number | undefined {
    return offset ? parseInt(offset) : undefined;
  }
}
