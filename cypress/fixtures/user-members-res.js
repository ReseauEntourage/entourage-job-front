import { faker } from '@faker-js/faker';

export const userMembersResponse = (numbersOfMembers) => {
  const userMembers = Array.from({ length: numbersOfMembers }, () => ({
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    role: 'Candidat',
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
      coach: null,
    },
    coach: null,
  }));

  return JSON.stringify(userMembers, null, 2);
};
