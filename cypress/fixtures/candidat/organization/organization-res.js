import { faker } from '@faker-js/faker';

const organizationResponse = () => {
  const referentFirstName = faker.person.firstName();
  const referentLastName = faker.person.lastName();

  const organization = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    zone: faker.location.city(),
    organizationReferent: {
      referentFirstName: referentFirstName,
      referentLastName: referentLastName,
      referentPhone: faker.phone.number(),
      referentMail: faker.internet.exampleEmail(
        referentFirstName,
        referentLastName
      ),
      updatedAt: faker.date.recent().toISOString(),
      createdAt: faker.date.recent().toISOString(),
    },
    updatedAt: faker.date.recent().toISOString(),
    createdAt: faker.date.recent().toISOString(),
  };

  return JSON.stringify(organization, null, 2);
};
