import { fakerFR as faker } from '@faker-js/faker';

export const generateAdminLoginApiResponse = () => {
  const loginResponse = {
    id: faker.string.uuid(),
    email: 'johndoe@mail.com',
    firstName: 'John',
    lastName: 'Doe',
    gender: 0,
    phone: faker.phone.number(),
    address: '01 rue Acme, 75001 Paris',
    zone: 'Paris',
    role: 'Admin',
    adminRole: 'Candidats',
    candidat: false,
    coach: false,
    lastConnection: '',
    sub: faker.string.uuid(),
  };

  return JSON.stringify(loginResponse, null, 2);
};
