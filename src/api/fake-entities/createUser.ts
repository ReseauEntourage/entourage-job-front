/* eslint-disable import/no-extraneous-dependencies */

import { faker } from '@faker-js/faker';
import { ADMIN_ZONES } from '../../constants/departements';
import { USER_ROLES, ADMIN_ROLES } from '../../constants/users';
import { UserDto } from '../types';

export function createFakeUser(): UserDto {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: faker.helpers.arrayElement([0, 1, 2]),
    phone: faker.phone.number(),
    role: faker.helpers.arrayElement(Object.values(USER_ROLES)),
    zone: faker.helpers.arrayElement(Object.values(ADMIN_ZONES)),
    adminRole: faker.helpers.arrayElement([
      ...Object.values(ADMIN_ROLES),
      undefined,
    ]),
  };
}
