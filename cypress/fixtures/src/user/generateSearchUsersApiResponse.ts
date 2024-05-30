import { fakerFR as faker } from '@faker-js/faker';

export const generateSearchUsersApiResponse = (numberOfUsersSearched) => {
  const users = Array.from({ length: numberOfUsersSearched }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: 'undefined',
  }));

  return JSON.stringify(users, null, 2);
};
