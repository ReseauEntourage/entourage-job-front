import { fakerFR as faker } from '@faker-js/faker';
/**
 * Profile > account user complet
 */
export const userProfile = () => {
  const userProfile = {
    description: 'We love dev',
    currentJob: null,
    networkBusinessLines: [],
    searchBusinessLines: [
      {
        id: '8c08d1d2-9cb4-4a93-afd3-4bdaaf039093',
        name: 'aev',
        order: 0,
        UserProfileSearchBusinessLine: {
          id: '54c6389c-ab98-4d02-84cc-e651164db9f7',
          UserProfileId: '8e2308b6-fe8e-4e68-b21f-4af8d946a503',
          BusinessLineI: '8c08d1d2-9cb4-4a93-afd3-4bdaaf039093',
          createdAt: '2023-12-28T10:22:06.388Z',
          updatedAt: '2023-12-28T10:22:06.388Z',
        },
      },
    ],
    searchAmbitions: [
      {
        id: 'd4d31f0d-3036-47f1-b3a3-cde0c1d0ec8b',
        name: 'test',
        prefix: 'comme',
        order: 0,
        UserProfileSearchAmbition: {
          id: '77f613bc-a2af-405a-ab5c-c9bc470b8f77',
          UserProfileId: '8e2308b6-fe8e-4e68-b21f-4af8d946a503',
          AmbitionId: 'd4d31f0d-3036-47f1-b3a3-cde0c1d0ec8b',
          createdAt: '2023-12-28T10:22:06.415Z',
          updatedAt: '2023-12-28T10:22:06.415Z',
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

  return JSON.stringify(userProfile, null, 2);
};
