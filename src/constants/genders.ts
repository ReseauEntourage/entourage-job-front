const GENDERS = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
} as const;

export type Gender = (typeof GENDERS)[keyof typeof GENDERS];

export const GENDERS_FILTERS = [
  {
    label: 'Homme',
    value: GENDERS.MALE,
  },
  {
    label: 'Femme',
    value: GENDERS.FEMALE,
  },
  /*  {
       label: 'Autre',
       value: GENDERS.OTHER,
     }, */
];
