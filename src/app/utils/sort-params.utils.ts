/**
 * Przygotowanie parametrów sortowania.
 *
 * @param sortBy
 * @param direction
 */
export const prepareSortParams = (sortBy: string, direction: any) => {
  if (sortBy === null || direction === null) {
    return;
  }

  if (direction === 'asc') {
    return sortBy;
  } else {
    return `-${sortBy}`;
  }
};
