import { faker } from '@faker-js/faker';

const opportunityId = faker.string.uuid();

const businessLines = [
  {
    name: faker.lorem.word(),
    order: 0,
    OpportunityBusinessLine: {
      id: faker.string.uuid(),
      OpportunityId: opportunityId,
      BusinessLineId: faker.string.uuid(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
    },
  },
];

const opportunityUsers = {
  id: faker.string.uuid(),
  UserId: faker.string.uuid(),
  OpportunityId: opportunityId,
  status: 2,
  seen: true,
  bookmarked: true,
  archived: false,
  note: null,
  updatedAt: faker.date.past().toISOString(),
  recommended: false,
  user: {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: faker.number.int({ min: 0, max: 1 }),
    zone: faker.location.city(),
    phone: faker.phone.number(),
    candidat: {
      employed: false,
      hidden: false,
      url: `${faker.person.firstName()}-${faker.string.uuid()}`,
      coach: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        zone: null,
      },
    },
  },
};

export const userOpportunityAllRes = (numbersOfOpportunities) => {
  const opportunities = Array.from({ length: numbersOfOpportunities }, () => {
    return {
      id: opportunityId,
      updatedAt: faker.date.past().toISOString(),
      createdAt: faker.date.past().toISOString(),
      title: faker.person.jobTitle(),
      company: faker.company.name(),
      description: faker.lorem.paragraph(),
      companyDescription: faker.lorem.sentence(),
      numberOfPositions: 1,
      prerequisites: null,
      skills: null,
      contract: 'cdi',
      endOfContract: null,
      startOfContract: null,
      isPartTime: false,
      recruiterName: faker.person.lastName(),
      recruiterFirstName: faker.person.firstName(),
      recruiterPosition: faker.person.jobTitle(),
      isPublic: true,
      isValidated: true,
      isExternal: false,
      link: null,
      externalOrigin: null,
      recruiterMail: faker.internet.email(),
      date: faker.date.past().toISOString(),
      department: faker.location.county(),
      message: null,
      address: faker.location.zipCode(),
      driversLicense: false,
      workingHours: null,
      salary: null,
      otherInfo: null,
      createdBy: faker.string.uuid(),
      businessLines: businessLines,
      opportunityUsers: opportunityUsers,
    };
  });

  return JSON.stringify(opportunities, null, 2);
};
