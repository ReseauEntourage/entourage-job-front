import { faker } from '@faker-js/faker';

const userProfileCandidateDescriptionModifiedResponse = (numberOfHelpNeeds) => {
  const helpNeeds = Array.from({ length: numberOfHelpNeeds }, () => ({
    id: faker.string.uuid(),
    name: faker.lorem.word(),
  }));

  const response = {
    description: faker.lorem.sentence(),
    currentJob: faker.person.jobTitle(),
    networkBusinessLines: [],
    searchBusinessLines: [],
    searchAmbitions: [],
    helpOffers: [],
    helpNeeds: helpNeeds,
  };

  return JSON.stringify(response, null, 2);
};
