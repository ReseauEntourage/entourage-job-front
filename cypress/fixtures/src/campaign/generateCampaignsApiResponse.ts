import { fakerFR as faker } from '@faker-js/faker';

export const generateCampaignsApiResponse = (numberOfCampaigns: number) => {
  const campaigns = Array.from({ length: numberOfCampaigns }, () => ({
    id: faker.string.uuid(),
    address: faker.location.streetAddress(),
    antenne: faker.location.city(),
    time: faker.date.recent().toISOString(),
  }));

  return JSON.stringify(campaigns, null, 2);
};
