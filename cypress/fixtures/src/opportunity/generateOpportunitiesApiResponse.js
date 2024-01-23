import { fakerFR as faker } from '@faker-js/faker';

export const generateOpportunitiesApiResponse = (
  numberOfOpportunities,
  numberOfBusinessLines,
  wrapped = false
) => {
  let recruiterFirstName = faker.person.firstName();
  let recruiterLastName = faker.person.lastName();
  const recruiterFullName =
    faker.person.firstName() + ' ' + faker.person.lastName();

  const opportunityUsers = {
    id: faker.string.uuid(),
    UserId: faker.string.uuid(),
    OpportunityId: faker.string.uuid(),
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

  const businessLines = Array.from({ length: numberOfBusinessLines }, () => ({
    name: faker.lorem.lines(1),
    order: faker.number.int(10),
    OpportunityBusinessLine: {
      id: faker.string.uuid(),
      OpportunityId: faker.string.uuid(),
      BusinessLineId: faker.string.uuid(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  }));

  const opportunities = Array.from({ length: numberOfOpportunities }, () => ({
    id: faker.string.uuid(),
    title: faker.person.job_title_pattern,
    isPublic: false,
    isValidated: true,
    isArchived: false,
    isExternal: false,
    link: null,
    externalOrigin: null,
    company: faker.company.name(),
    recruiterName: recruiterFullName,
    recruiterFirstName: recruiterFirstName,
    recruiterMail: faker.internet.exampleEmail(
      recruiterFirstName,
      recruiterLastName
    ),
    contactMail: null,
    recruiterPosition: null,
    recruiterPhone: faker.phone.number(),
    date: faker.date.recent().toISOString(),
    address: faker.location.streetAddress(),
    description: null,
    companyDescription: faker.company.catchPhrase(),
    skills: null,
    prerequisites: null,
    department: faker.location.state(),
    contract: null,
    startOfContract: faker.date.recent().toISOString(),
    endOfContract: faker.date.recent().toISOString(),
    isPartTime: false,
    numberOfPositions: 1,
    message: null,
    driversLicense: 1,
    workingHours: null,
    salary: faker.number.int(10000),
    otherInfo: null,
    createdBy: faker.string.uuid(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    opportunityUsers: opportunityUsers,
    businessLines: businessLines,
  }));

  const jsonResponse = wrapped ? { offers: opportunities } : opportunities;

  return JSON.stringify(jsonResponse, null, 2);
};
