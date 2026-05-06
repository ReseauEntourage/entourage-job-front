import { fakerFR as faker } from '@faker-js/faker';

export const generateUserLoginApiResponse = (roleUser: string) => {
  const userBase = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.exampleEmail(),
    phone: faker.phone.number(),
    zone: 'PARIS',
    gender: 0,
    lastConnection: '',
    OrganizationId: null,
    refererId: null,
    isEmailVerified: true,
    userSocialSituation: { hasCompletedSurvey: false },
    onboardingStatus: 'completed',
    onboardingCompletedAt: null,
    onboardingWebinarSkippedAt: null,
  };

  const userCandidate = {
    ...userBase,
    role: 'Candidat',
  };

  const userCoach = {
    ...userBase,
    OrganizationId: faker.string.uuid(),
    role: 'Coach externe',
  };

  let userLogin = {};

  switch (roleUser) {
    case 'Candidate':
      userLogin = userCandidate;
      break;
    case 'Coach':
      userLogin = userCoach;
      break;
    default:
      userLogin = userBase;
  }

  return JSON.stringify(userLogin, null, 2);
};
