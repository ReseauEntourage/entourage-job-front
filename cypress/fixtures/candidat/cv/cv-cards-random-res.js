import { faker } from '@faker-js/faker';

const fixtCvCardsRandomResponse = (numberOfCvCards) => {
  const cvCards = Array.from({ length: numberOfCvCards }, () => ({
    id: faker.string.uuid(),
    catchphrase: faker.lorem.sentence(),
    urlImg: 'images/33e64d73-a66b-40ad-9e81-99060243aa37.Published.jpg',
    updatedAt: faker.date.past().toISOString(),
    ambitions: [],
    skills: [],
    businessLines: [],
    locations: [],
    user: {
      employed: false,
      hidden: false,
      url: '',
      endOfContract: null,
      coach: {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: faker.number.int(1),
      },
      candidat: {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: faker.number.int(1),
      },
    },
    ranking: faker.number.float(),
  }));

  return JSON.stringify(cvCards, null, 2);
};
