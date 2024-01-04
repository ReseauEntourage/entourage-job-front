import { faker } from '@faker-js/faker';

const userAdminSearchCandidatesResponses = (numberOfCandidates) => {
  const candidates = Array.from({ length: numberOfCandidates }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: 'Candidat',
  }));

  return JSON.stringify(candidates, null, 2);
};
