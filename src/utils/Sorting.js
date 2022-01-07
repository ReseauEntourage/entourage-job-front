const sortByOrder = (list) => {
  const listToSort = JSON.parse(JSON.stringify(list));
  listToSort.sort((a, b) => {
    return a.order < b.order ? -1 : 1;
  });
  return listToSort;
};

const sortByName = (list) => {
  const listToSort = JSON.parse(JSON.stringify(list));
  listToSort.sort((a, b) => {
    return a.name.localeCompare(b.name) < 0 ? -1 : 1;
  });
  return listToSort;
};

export { sortByOrder, sortByName };
