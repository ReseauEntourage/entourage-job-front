import { fakerFR as faker } from '@faker-js/faker';

export const generateNudgesApiResponse = (numberOfNudges) => {
  const nudges = Array.from({ length: numberOfNudges }, (_, i) => {
    const value = faker.helpers.arrayElement([
      'tips',
      'interview',
      'cv',
      'event',
      'network',
    ]);
    return {
      id: faker.string.uuid(),
      value,
      nameRequest: `${value} request`,
      nameOffer: `${value} offer`,
      order: i,
    };
  });

  return JSON.stringify(nudges, null, 2);
};
