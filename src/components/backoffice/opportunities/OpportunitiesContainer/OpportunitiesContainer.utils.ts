export const renderTabFromStatus = (status, archived) => {
  const statusToTab = [
    {
      status: -1,
      tab: 0,
    },
    {
      status: 0,
      tab: 1,
    },
    {
      status: 1,
      tab: 2,
    },
    {
      status: 2,
      tab: 4,
    },
    {
      status: 3,
      tab: 3,
    },
    {
      status: 4,
      tab: 3,
    },
  ];
  if (archived) {
    return 3;
  }
  if (
    !statusToTab.find((tab) => {
      return tab.status === status;
    })
  ) {
    return 0;
  }
  return statusToTab.find((tab) => {
    return tab.status === status;
  }).tab;
};
