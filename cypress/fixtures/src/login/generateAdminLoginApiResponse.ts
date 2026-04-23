import { fakerFR as faker } from '@faker-js/faker';

export const generateAdminLoginApiResponse = () => {
  const loginResponse = {
    id: faker.string.uuid(),
    email: 'johndoe@mail.com',
    firstName: 'John',
    lastName: 'Doe',
    gender: 0,
    phone: faker.phone.number(),
    zone: 'PARIS',
    role: 'Admin',
    OrganizationId: null,
    refererId: null,
    lastConnection: '',
    isEmailVerified: true,
    userSocialSituation: { hasCompletedSurvey: false },
    onboardingStatus: 'completed',
    onboardingCompletedAt: null,
    onboardingWebinarSkippedAt: null,
  };

  return JSON.stringify(loginResponse, null, 2);
};
