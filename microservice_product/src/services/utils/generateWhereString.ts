export function generateWhereIdString(productIdParam: string): string {
  const ids = productIdParam.split(",");

  return ids?.length > 1
    ? `id in (${createWhereStringForInPredicate(ids)})`
    : `id="${productIdParam}"`;
}

function createWhereStringForInPredicate(predicateStringArr: string[]): string {
  const predicateStringsWithQuote = '"' + predicateStringArr.join('", "') + '"';

  return predicateStringsWithQuote;
}
