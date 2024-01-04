import { faker } from '@faker-js/faker';

const userSearchCandidatesResponses = (numberOfCandidates) => {
  const candidates = Array.from({ length: numberOfCandidates }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: UserRole.CANDIDATE,
  }));

  return JSON.stringify(candidates, null, 2);
};
