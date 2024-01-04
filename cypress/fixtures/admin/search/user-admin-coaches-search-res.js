import { faker } from '@faker-js/faker';

const userAdminSearchCoachesResponses = (numberOfCoaches) => {
  const coaches = Array.from({ length: numberOfCoaches }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: 'Coach',
  }));

  return JSON.stringify(coaches, null, 2);
};
