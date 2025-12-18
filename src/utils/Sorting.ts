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

export function sortByDateStart<T extends { dateStart?: Date }[]>(list: T) {
  const listToSort = JSON.parse(JSON.stringify(list));
  listToSort.sort((a, b) => {
    if (typeof a.dateStart === 'string') {
      a.dateStart = Date.parse(a.dateStart);
    }
    if (typeof b.dateStart === 'string') {
      b.dateStart = Date.parse(b.dateStart);
    }
    return b.dateStart - a.dateStart;
  });
  return listToSort;
}
