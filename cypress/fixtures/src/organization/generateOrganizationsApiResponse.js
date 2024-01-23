import { fakerFR as faker } from '@faker-js/faker';

export const generateOrganizationsApiResponse = (numberOfOrganizations) => {
  const organizations = Array.from(
    { length: numberOfOrganizations },
    (_, i) => {
      const referentFirstName = faker.person.firstName();
      const referentLastName = faker.person.lastName();

      return {
        id: faker.string.uuid(),
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        zone: faker.location.city(),
        organizationReferent: {
          referentFirstName: referentFirstName,
          referentLastName: referentLastName,
          referentPhone: faker.phone.number(),
          referentMail: faker.internet.exampleEmail(),
          updatedAt: faker.date.recent().toISOString(),
          createdAt: faker.date.recent().toISOString(),
        },
        updatedAt: faker.date.recent().toISOString(),
        createdAt: faker.date.recent().toISOString(),
      };
    }
  );

  organizations.push({
    id: faker.string.uuid(),
    name: 'Entourage',
    address: faker.location.streetAddress(),
    zone: faker.location.city(),
    organizationReferent: {
      referentFirstName: faker.person.firstName(),
      referentLastName: faker.person.lastName(),
      referentPhone: faker.phone.number(),
      referentMail: faker.internet.exampleEmail(),
      updatedAt: faker.date.recent().toISOString(),
      createdAt: faker.date.recent().toISOString(),
    },
    updatedAt: faker.date.recent().toISOString(),
    createdAt: faker.date.recent().toISOString(),
  });

  return JSON.stringify(organizations, null, 2);
};
