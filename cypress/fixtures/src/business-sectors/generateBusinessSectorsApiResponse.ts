import { fakerFR as faker } from '@faker-js/faker';

export const generateBusinessSectorsApiResponse = (
  numberOfBussinessSectors
) => {
  const bsectors = Array.from({ length: numberOfBussinessSectors }, (_, i) => {
    return {
      id: faker.string.uuid(),
      name: `Sector ${i + 1}`,
      value: `sector-${i + 1}`,
      prefixes: "eul',les",
      order: i,
    };
  });

  return JSON.stringify(bsectors, null, 2);
};
