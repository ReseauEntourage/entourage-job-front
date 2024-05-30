import { fakerFR as faker } from '@faker-js/faker';

export const generateCvUrlApiResponse = () => {
  const cv = {
    cv: {
      id: faker.string.uuid(),
      UserId: faker.string.uuid(),
      urlImg: 'images/33e64d73-a66b-40ad-9e81-99060243aa37.Published.jpg',
      intro: null,
      story: null,
      location: null,
      availability: 'Tous les jours et weekends',
      transport: 'permis b',
      catchphrase: faker.person.jobDescriptor(),
      status: 'Published',
      version: 30,
      lastModifiedBy: null,
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      deletedAt: null,
      contracts: [],
      languages: [
        {
          name: 'fr',
        },
        {
          name: 'en',
        },
      ],
      passions: [],
      skills: [],
      ambitions: [],
      businessLines: [
        {
          name: 'Artisanat / Art',
          order: -1,
        },
        {
          name: 'Bâtiment',
          order: -1,
        },
        {
          name: 'Associatif',
          order: -1,
        },
      ],
      locations: [
        {
          name: 'Paris (75)',
        },
        {
          name: 'Val-de-Marne (94)',
        },
        {
          name: 'Seine-Saint-Denis (93)',
        },
        {
          name: 'Seine-et-Marne (77)',
        },
        {
          name: 'Essonne (91)',
        },
        {
          name: 'Yvelines (78)',
        },
        {
          name: "Val-d'Oise (95)",
        },
        {
          name: 'Hauts-de-Seine (92)',
        },
      ],
      experiences: [],
      reviews: [],
      user: {
        employed: false,
        hidden: false,
        url: 'vaitecandidat-33e64d73',
        endOfContract: null,
        coach: {
          id: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          gender: 1,
        },
        candidat: {
          id: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          gender: 1,
        },
      },
    },
    exists: true,
  };
  return JSON.stringify(cv, null, 2);
};
