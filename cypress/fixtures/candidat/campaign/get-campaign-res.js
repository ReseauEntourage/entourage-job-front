import { faker } from '@faker-js/faker';

const getCampaignsResponse = (numberOfCampaigns) => {
  const campaigns = Array.from({ length: numberOfCampaigns }, (_, i) => ({
    id: i,
    address: faker.location.streetAddress(),
    antenne: faker.location.city(),
    time: faker.date.recent().toISOString(),
  }));

  return JSON.stringify(campaigns, null, 2);
};
