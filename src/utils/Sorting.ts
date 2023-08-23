export function sortByOrder<T extends { order: number }[]>(list: T) {
  const listToSort: T = JSON.parse(JSON.stringify(list));
  listToSort.sort((a, b) => {
    return a.order < b.order ? -1 : 1;
  });
  return listToSort;
}

export function sortByName<T extends { name: string }[]>(list: T) {
  const listToSort: T = JSON.parse(JSON.stringify(list));
  listToSort.sort((a, b) => {
    return a.name.localeCompare(b.name) < 0 ? -1 : 1;
  });
  return listToSort;
}
