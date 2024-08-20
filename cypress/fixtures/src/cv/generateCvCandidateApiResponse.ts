import { faker } from '@faker-js/faker';

export const generateCvCandidateApiResponse = () => {
  const _id = faker.string.uuid();

  const candidateCv = {
    id: _id,
    UserId: faker.string.uuid(),
    urlImg: 'images/33e64d73-a66b-40ad-9e81-99060243aa37.Published.jpg',
    intro: faker.person.bio(),
    story: faker.lorem.lines(1),
    availability: faker.word.words(3),
    transport: '',
    catchphrase: faker.lorem.sentence(4),
    status: '',
    version: 1,
    lastModifiedBy: faker.string.uuid(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    deletedAt: null,
    contracts: [
      {
        id: faker.string.uuid(),
        name: 'CDI',
        CVContract: {
          id: faker.string.uuid(),
          CVId: _id,
          ContractId: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        },
      },
    ],
    languages: [
      {
        id: faker.string.uuid(),
        name: faker.location.country(),
        CVLanguage: {
          id: faker.string.uuid(),
          CVId: _id,
          languageId: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        },
      },
    ],
    passions: [
      {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        CVPassion: {
          id: faker.string.uuid(),
          CVId: _id,
          PassionId: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        },
      },
    ],
    skills: [
      {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        CVSkill: {
          id: faker.string.uuid(),
          CVId: _id,
          SkillId: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        },
      },
    ],
    ambitions: [
      {
        id: faker.string.uuid(),
        name: faker.person.jobTitle(),
        prefix: '',
        order: 0,
        CVAmbition: {
          id: faker.string.uuid(),
          CVId: _id,
          AmbitionId: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        },
      },
    ],
    businessLines: [
      {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        order: 1,
        CVBusinessLine: {
          id: faker.string.uuid(),
          CVId: _id,
          BusinessLineId: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        },
      },
    ],
    locations: [
      {
        id: faker.string.uuid(),
        name: faker.location.city(),
        CVLocation: {
          id: faker.string.uuid(),
          CVId: _id,
          LocationId: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        },
      },
    ],
    user: {
      employed: false,
      hidden: false,
      url: 'michael-198e8950',
      coach: {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: 1,
        email: faker.internet.exampleEmail(),
      },
      candidat: {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: 0,
        email: faker.internet.exampleEmail(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        zone: 'PARIS',
      },
    },
    reviews: [
      {
        id: faker.string.uuid(),
        text: faker.lorem.sentence(5),
        status: faker.person.jobArea(),
        name: faker.person.fullName(),
      },
    ],
    experiences: [
      {
        id: faker.string.uuid(),
        description: faker.person.jobType(),
        order: 0,
        skills: [],
      },
    ],
    formations: [
      {
        id: faker.string.uuid(),
        description: faker.person.jobDescriptor(),
        skills: [],
      },
    ],
  };

  return JSON.stringify(candidateCv, null, 2);
};
