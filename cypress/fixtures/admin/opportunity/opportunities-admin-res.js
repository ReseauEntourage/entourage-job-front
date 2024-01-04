import { faker } from '@faker-js/faker';

const opportunitiesAdminResponses = (
  numberOfOpportunities,
  numberOfOpportunityUsers,
  numberOfBusinessLines
) => {
  let recruiterFirstName = faker.person.firstName();
  let recruiterLastName = faker.person.lastName();
  const recruiterFullName =
    faker.person.firstName() + ' ' + faker.person.lastName();

  const opportunityUsers = Array.from(
    { length: numberOfOpportunityUsers },
    () => {
      let userFirstName = faker.person.firstName();
      let userLastName = faker.person.lastName();
      let userId = faker.string.uuid();
      return {
        id: faker.string.uuid(),
        UserId: userId,
        OpportunityId: faker.string.uuid(),
        status: faker.number.int(),
        bookmarked: faker.number.int(1),
        archived: faker.number.int(1),
        note: null,
        seen: faker.datatype.boolean(),
        recommended: faker.datatype.boolean(),
        user: {
          id: faker.string.uuid(),
          email: faker.internet.exampleEmail(userFirstName, userLastName),
          firstName: userFirstName,
          lastName: userLastName,
          gender: faker.number.int(1),
          zone: faker.location.city(),
        },
      };
    }
  );

  const businessLines = Array.from({ length: numberOfBusinessLines }, () => ({
    name: faker.lorem.text(),
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
    title: faker.person.jobTitle(),
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

  console.log(JSON.stringify(opportunities, null, 2));

  return JSON.stringify(opportunities, null, 2);
};

opportunitiesAdminResponses(4, 2, 3);
