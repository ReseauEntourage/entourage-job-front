import { fakerFR as faker } from '@faker-js/faker';

export const generateAdminLoginApiResponse = () => {
  const loginResponse = {
    id: faker.string.uuid(),
    email: 'johndoe@mail.com',
    firstName: 'John',
    lastName: 'Doe',
    gender: 0,
    phone: faker.phone.number(),
    zone: 'Paris',
    role: 'Admin',
    candidat: false,
    coach: false,
    lastConnection: '',
    sub: faker.string.uuid(),
  };

  return JSON.stringify(loginResponse, null, 2);
};
