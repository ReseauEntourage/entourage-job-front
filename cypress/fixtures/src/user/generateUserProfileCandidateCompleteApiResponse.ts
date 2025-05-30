/**
 * Profile > account user complet
 */
export const userProfile = () => {
  const profile = {
    introduction: 'Je cherche un emploi dans le secteur de la technologie.',
    description:
      "Je suis un développeur passionné par la technologie et l'innovation.",
    currentJob: null,
    sectorOccupations: [
      {
        id: '8c08d1d2-9cb4-4a93-afd3-4bdaaf039093',
        order: 0,
        businessSector: {
          id: '8c08d1d2-9cb4-4a93-afd3-4bdaaf039093',
          name: 'aev',
        },
        occupation: {
          id: 'd4d31f0d-3036-47f1-b3a3-cde0c1d0ec8b',
          name: 'test',
          prefix: 'comme',
        },
      },
    ],
    userProfileNudges: [
      {
        id: 'de999805-1381-42fd-b5c1-3dbe7fc3392a',
        content: "J'ai besoin d'aide pour review mon code",
        createdAt: '2025-04-14T00:00:00.000Z',
        nudge: null,
      },
      {
        id: '181a0e77-8e5f-4d02-ab1d-900f70d8e2ff',
        content: null,
        createdAt: '2025-04-14T00:00:00.000Z',
        nudge: {
          id: 'f0c6c2e7-7176-41d7-bfc7-2e4d5a543f15',
          value: 'event',
          nameRequest:
            'Se rencontrer et échanger avec les membres de la communauté',
          nameOffer:
            'Se rencontrer lors d’événements avec les membres de la communauté',
          order: 4,
        },
      },
    ],
  };

  return JSON.stringify(profile, null, 2);
};
