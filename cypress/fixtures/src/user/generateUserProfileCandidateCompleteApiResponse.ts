import { fakerFR as faker } from '@faker-js/faker';
/**
 * Profile > account user complet
 */
export const userProfile = () => {
  const profile = {
    description: 'We love dev',
    currentJob: null,
    businessSectors: [
      {
        id: '8c08d1d2-9cb4-4a93-afd3-4bdaaf039093',
        name: 'aev',
        order: 0,
        UserProfileBusinessSector: {
          id: '54c6389c-ab98-4d02-84cc-e651164db9f7',
        },
      },
    ],
    occupations: [
      {
        id: 'd4d31f0d-3036-47f1-b3a3-cde0c1d0ec8b',
        name: 'test',
        prefix: 'comme',
        order: 0,
        UserProfileOccupation: {
          id: '77f613bc-a2af-405a-ab5c-c9bc470b8f77',
        },
      },
    ],
    helpOffers: [],
    helpNeeds: [
      {
        id: '352a7dde-c4ad-410f-86cf-506cdc9eb624',
        name: 'interview',
      },
      {
        id: '352a7dde-c4ad-410f-86cf-506cdc9eb624',
        name: 'cv',
      },
      {
        id: '352a7dde-c4ad-410f-86cf-506cdc9eb624',
        name: 'tips',
      },
    ],
  };

  return JSON.stringify(profile, null, 2);
};
