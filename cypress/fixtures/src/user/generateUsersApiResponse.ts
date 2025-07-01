import { fakerFR as faker } from '@faker-js/faker';

export const generateUsersApiResponse = (numbersOfUsers, roleUsers) => {
  const users = Array.from({ length: numbersOfUsers }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    role: roleUsers,
    adminRole: null,
    zone: faker.location.city(),
    gender: faker.number.int(1),
    lastConnection: null,
    candidat: {
      coachId: null,
      employed: false,
      hidden: true,
      note: null,
      url: '',
      contract: null,
      endOfContract: null,
      lastModifiedBy: null,
      cvs: [],
      coach: {},
    },
    coaches: [
      {
        coachId: null,
        employed: false,
        hidden: true,
        note: null,
        url: '',
        contract: null,
        endOfContract: null,
        lastModifiedBy: null,
        cvs: [],
        candidat: {},
      },
    ],
    userProfile: {
      id: faker.string.uuid(),
      hasPicture: false,
    },
  }));

  return JSON.stringify(users, null, 2);
};
