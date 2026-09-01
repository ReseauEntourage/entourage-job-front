import { fakerFR as faker } from '@faker-js/faker';

export const generateConversationsApiResponse = (count = 5) => {
  const conversations = Array.from({ length: count }, (_, index) => {
    const currentUserId = '00000000-0000-0000-0000-000000000001';
    const addreseeId = faker.string.uuid();
    const createdAt = new Date(
      Date.UTC(2024, 5, 1, 9, 0, 0) - index * 60 * 60 * 1000
    ).toISOString();

    return {
      id: faker.string.uuid(),
      type: 'direct',
      createdAt,
      updatedAt: createdAt,
      seenAt: null,
      participants: [
        {
          id: currentUserId,
          firstName: 'Current',
          lastName: 'User',
          role: 'Coach',
          gender: 0,
          zone: 'PARIS',
          email: 'current-user@entourage.social',
          elearningCompletedAt: '2024-01-01T00:00:00.000Z',
          userProfile: { hasPicture: false, unavailableAt: null },
          conversationParticipant: {
            id: faker.string.uuid(),
            seenAt: createdAt,
            createdAt,
            updatedAt: createdAt,
          },
        },
        {
          id: addreseeId,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          role: 'Candidat',
          gender: 0,
          zone: 'PARIS',
          email: faker.internet.exampleEmail(),
          elearningCompletedAt: '2024-01-01T00:00:00.000Z',
          userProfile: { hasPicture: false, unavailableAt: null },
          conversationParticipant: {
            id: faker.string.uuid(),
            seenAt: null,
            createdAt,
            updatedAt: createdAt,
          },
        },
      ],
      messages: [
        {
          id: faker.string.uuid(),
          content: faker.lorem.sentence(),
          authorId: addreseeId,
          createdAt,
          updatedAt: createdAt,
          conversationId: faker.string.uuid(),
          medias: [],
          author: {
            id: addreseeId,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            role: 'Candidat',
          },
        },
      ],
    };
  });

  return JSON.stringify(conversations, null, 2);
};
