export class CTService {
  protected customerId: string;

  public setCTCustomer(customerId: string) {
    this.customerId = customerId;
  }

  protected createWhereStringForInPredicate(predicateStringArr: string[]) {
    const predicateStringsWithQuote =
      '"' + predicateStringArr.join('", "') + '"';

    return predicateStringsWithQuote;
  }
}
