export function generateWhereString(whereParams: {
  orderIdParam?: string;
  orderNumberParam?: string;
}): string {
  const { orderIdParam, orderNumberParam } = whereParams;

  if (orderIdParam) {
    const predicateIds = orderIdParam.split(",");
    return predicateIds?.length > 1
      ? `id in (${createWhereStringForInPredicate(predicateIds)})`
      : `id="${orderIdParam}"`;
  }

  if (orderNumberParam) {
    const predicateCustomerNumbers = orderNumberParam.split(",");
    return predicateCustomerNumbers?.length > 1
      ? `orderNumber in (${createWhereStringForInPredicate(
          predicateCustomerNumbers,
        )})`
      : `orderNumber="${orderNumberParam}"`;
  }

  return undefined;
}

function createWhereStringForInPredicate(predicateStringArr: string[]): string {
  const predicateStringsWithQuote = '"' + predicateStringArr.join('", "') + '"';

  return predicateStringsWithQuote;
}
