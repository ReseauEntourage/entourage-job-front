import { fakerFR as faker } from '@faker-js/faker';

export const generateUserLoginApiResponse = (roleUser) => {
  // initialize userBase with candidate and coach commons info.
  const userBase = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.exampleEmail(),
    phone: faker.phone.number(),
    address: null,
    adminRole: null,
    zone: 'PARIS',
    gender: 0,
    lastConnection: '',
    readDocuments: [],
  };

  // initialize userCandidate with candidate info. expected
  const userCandidate = {
    ...userBase,
    role: 'Candidat',
    coach: null,
    userProfile: {
      introduction: null,
      description: null,
      currentJob: null,
      sectorOccupations: [
        {
          id: faker.string.uuid(),
          businessSector: {
            id: faker.string.uuid(),
            name: 'aev',
          },
          occupation: null,
          order: 0,
        },
      ],
    },
    readDocuments: [],
  };

  // initialize userCoach with coach info. expected
  const userCoach = {
    ...userBase,
    OrganizationId: faker.string.uuid(),
    role: 'Coach externe',
    candidat: null,
    readDocuments: [],
    organization: {
      id: '99aca0a7-3154-4fbe-b149-700a9de44871',
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      zone: 'PARIS',
    },
    userProfile: {
      introduction: null,
      description: null,
      currentJob: null,
      sectorOccupations: [
        {
          id: faker.string.uuid(),
          businessSector: null,
          occupation: {
            id: faker.string.uuid(),
            name: faker.person.jobTitle(),
          },
          order: 0,
        },
      ],
    },
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
