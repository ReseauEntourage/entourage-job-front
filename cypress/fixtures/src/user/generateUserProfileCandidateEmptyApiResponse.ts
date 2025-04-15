import { fakerFR as faker } from '@faker-js/faker';

export const generateUserProfileCandidateApiResponse = () => {
  const response = {
    description: 'We love dev',
    currentJob: faker.person.jobTitle(),
    sectorOccupations: [],
    occupations: [],
    userProfileNudges: [],
  };

  return JSON.stringify(response, null, 2);
};
