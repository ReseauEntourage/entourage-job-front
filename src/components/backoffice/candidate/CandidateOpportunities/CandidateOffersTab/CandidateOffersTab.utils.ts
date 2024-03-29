export const tabs = [
  {
    status: [-1],
    text: 'offres à traiter',
  },
  {
    status: [0],
    text: 'offres contactées',
  },
  {
    status: [1],
    text: "offres en phase d'entretien",
  },
  {
    status: [3, 4, 'archived'],
    text: 'offres abandonnées',
  },
  {
    status: [2],
    text: 'offres acceptées',
  },
];

export const TabsLabels = tabs.map(({ text }) => {
  return text;
});

export type TabsLabelsType = (typeof TabsLabels)[keyof typeof TabsLabels];

export const tabsStatus = tabs.map(({ status }) => {
  return status;
});

export const formatPlural = (text: string, count: number): string => {
  if (count <= 1) {
    text = text.replace('s ', ' ');
    if (text.charAt(text.length - 1) === 's') {
      return text.substring(0, text.length - 1);
    }
  }
  return text;
};
