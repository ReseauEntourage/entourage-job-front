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
    candidat: {
      employed: false,
      hidden: false,
      note: '',
      url: 'michael-198e8950',
      contract: null,
      endOfContract: null,
      lastModifiedBy: '',
      coach: null,
    },
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
      userProfileNudges: [
        {
          id: faker.string.uuid(),
          content: null,
          createdAt: faker.date.past(),
          nudge: {
            id: faker.string.uuid(),
            value: 'interview',
            nameRequest: 'Se préparer aux entretiens d’embauche',
            nameOffer: 'Aider à préparer les entretiens d’embauche',
            order: 1,
          },
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
    coaches: [
      {
        employed: false,
        hidden: false,
        note: null,
        url: 'arnold-93336b4d',
        contract: null,
        endOfContract: null,
        lastModifiedBy: null,
        candidat: {
          id: faker.string.uuid(),
          OrganizationId: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.exampleEmail(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          role: 'Candidat',
          adminRole: null,
          zone: 'PARIS',
          gender: 1,
          lastConnection: null,
          userProfile: {
            introduction: null,
            description: null,
            currentJob: null,
            department: null,
            isAvailable: true,
            sectorOccupations: [],
            userProfileNudges: [],
          },
        },
      },
    ],
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
      userProfileNudges: [
        {
          id: faker.string.uuid(),
          content: null,
          createdAt: faker.date.past(),
          nudge: {
            id: faker.string.uuid(),
            value: 'interview',
            nameRequest: 'Se préparer aux entretiens d’embauche',
            nameOffer: 'Aider à préparer les entretiens d’embauche',
            order: 1,
          },
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
