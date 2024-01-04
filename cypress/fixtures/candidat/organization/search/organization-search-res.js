import { faker } from '@faker-js/faker';

export const organizationSearchResponse = (numberOfOrganizations) => {
  const organizations = Array.from(
    { length: numberOfOrganizations },
    (_, i) => {
      const referentFirstName = faker.person.firstName();
      const referentLastName = faker.person.lastName();

      const nameOrganization =
        i % 2 > 1 ? 'Entourage ' + faker.company.name() : faker.company.name();

      return {
        id: faker.string.uuid(),
        name: nameOrganization,
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

  return JSON.stringify(organizations, null, 2);
};
