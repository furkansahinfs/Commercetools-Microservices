export const getWhereString = (whereParams: {
  customerIdParam?: string;
  customerNumberParam?: string;
}): string | undefined => {
  const { customerIdParam, customerNumberParam } = whereParams;

  if (customerIdParam) {
    const predicateIds = customerIdParam.split(",");
    return predicateIds?.length > 1
      ? `id in (${createWhereStringForInPredicate(predicateIds)})`
      : `id="${customerIdParam}"`;
  }

  if (customerNumberParam) {
    const predicateCustomerNumbers = customerNumberParam.split(",");
    return predicateCustomerNumbers?.length > 1
      ? `customerNumber in (${createWhereStringForInPredicate(
          predicateCustomerNumbers,
        )})`
      : `customerNumber="${customerIdParam}"`;
  }

  return undefined;
};

const createWhereStringForInPredicate = (
  predicateStringArr: string[],
): string => {
  const predicateStringsWithQuote = '"' + predicateStringArr.join('", "') + '"';

  return predicateStringsWithQuote;
};
