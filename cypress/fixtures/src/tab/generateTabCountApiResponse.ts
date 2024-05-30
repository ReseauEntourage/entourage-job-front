import { fakerFR as faker } from '@faker-js/faker';

export const generateTabCountApiResponse = (numberOfTab) => {
  const tabCount = Array.from({ length: numberOfTab }, (_, i) => ({
    // 5 % 2 = 1
    status: i < numberOfTab % 2 ? 'archived' : i,
    count: faker.number.int({ min: 0, max: 10 }).toString(),
  }));

  return JSON.stringify(tabCount, null, 2);
};
