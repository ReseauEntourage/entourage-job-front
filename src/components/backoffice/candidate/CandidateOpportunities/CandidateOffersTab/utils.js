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
    status: [3, 4],
    text: 'offres abandonnées',
  },
  {
    status: [2],
    text: 'offres acceptées',
  },
];

export const formatPlural = (text, count) => {
  if (count <= 1) {
    text = text.replace('s ', ' ');
  }
  return text;
};
