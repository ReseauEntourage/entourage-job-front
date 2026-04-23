export function sortByOrder<T extends { order: number }[]>(list: T) {
  const listToSort: T = JSON.parse(JSON.stringify(list));
  listToSort.sort((a, b) => {
    return a.order < b.order ? -1 : 1;
  });
  return listToSort;
}
