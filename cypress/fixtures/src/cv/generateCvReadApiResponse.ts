import { fakerFR as faker } from '@faker-js/faker';

export const generateCvReadApiResponse = () => {
  const cvRead = {
    id: faker.string.uuid(),
    UserId: faker.string.uuid(),
    urlImg: 'images/198e8950-d5be-4e82-aaf8-d18840dffba1.Progress.jpg',
    intro: faker.lorem.sentence(5),
    story: faker.person.jobDescriptor(),
    availability: 'Semaine, week-end, journée',
    transport: 'Pas de Permis',
    catchphrase: faker.company.catchPhrase(),
    status: 'Progress',
    version: 110,
    lastModifiedBy: faker.string.uuid(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    deletedAt: null,
    contracts: [
      {
        id: faker.string.uuid(),
        name: 'Cdi, cdd, intérim, immersion',
        CVContract: {
          id: faker.string.uuid(),
          CVId: faker.string.uuid(),
          ContractId: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        },
      },
    ],
    languages: [
      {
        id: faker.string.uuid(),
        name: 'Français et arabe',
        CVLanguage: {
          id: '02037635-f9a3-479f-918c-737e4b0a75c7',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          LanguageId: 'c2eca4de-2ec7-482e-af4b-24ac89e16186',
          createdAt: '2022-03-11T11:06:11.047Z',
          updatedAt: '2022-03-11T11:06:11.047Z',
        },
      },
    ],
    passions: [
      {
        id: '7332a860-c49c-49b3-99ae-bd61baed7de3',
        name: 'Film et cinéma',
        CVPassion: {
          id: '3ccd10b8-b40e-489e-86f0-01cf8a7622e8',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          PassionId: '7332a860-c49c-49b3-99ae-bd61baed7de3',
          createdAt: '2022-03-11T11:06:11.060Z',
          updatedAt: '2022-03-11T11:06:11.060Z',
        },
      },
      {
        id: '2c508e3d-4b58-419d-b704-dac0b25c3565',
        name: 'Chanter',
        CVPassion: {
          id: '661d509a-3763-40f9-bfd1-3170f13b28fa',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          PassionId: '2c508e3d-4b58-419d-b704-dac0b25c3565',
          createdAt: '2022-03-11T11:06:11.060Z',
          updatedAt: '2022-03-11T11:06:11.060Z',
        },
      },
      {
        id: '6838d408-a058-4d93-a7a8-9e95e9b9b060',
        name: 'Sport',
        CVPassion: {
          id: 'b3ca3fa9-8869-4c90-b1b8-aaf2030c52fc',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          PassionId: '6838d408-a058-4d93-a7a8-9e95e9b9b060',
          createdAt: '2022-03-11T11:06:11.060Z',
          updatedAt: '2022-03-11T11:06:11.060Z',
        },
      },
      {
        id: '9747136f-f394-41d1-ba93-4017643c728e',
        name: 'Danse',
        CVPassion: {
          id: 'a6fc4903-d84b-4122-9062-294b1aae28f0',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          PassionId: '9747136f-f394-41d1-ba93-4017643c728e',
          createdAt: '2022-03-11T11:06:11.060Z',
          updatedAt: '2022-03-11T11:06:11.060Z',
        },
      },
    ],
    skills: [
      {
        id: '36121048-99d2-41a9-a385-ee1c44263b1b',
        name: 'blabla ',
        CVSkill: {
          id: 'c19a77ab-f6a9-4b36-95c1-f07f44044562',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          SkillId: '36121048-99d2-41a9-a385-ee1c44263b1b',
          createdAt: '2022-03-11T11:06:11.073Z',
          updatedAt: '2022-03-11T11:06:11.073Z',
        },
      },
      {
        id: '2424a858-b107-44ba-847b-dece1f0ad859',
        name: 'atout 2',
        CVSkill: {
          id: '346c2123-a9ba-4ba9-8312-0cdd00f4ce8f',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          SkillId: '2424a858-b107-44ba-847b-dece1f0ad859',
          createdAt: '2022-03-11T11:06:11.073Z',
          updatedAt: '2022-03-11T11:06:11.073Z',
        },
      },
    ],
    ambitions: [
      {
        id: '06eb86fd-c08e-408d-b707-990859065a55',
        name: 'technicien systèmes et réseaux',
        prefix: 'comme',
        order: 1,
        CVAmbition: {
          id: '003fb7e7-11b3-4e66-9449-a35ff2c39aa0',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          AmbitionId: '06eb86fd-c08e-408d-b707-990859065a55',
          createdAt: '2022-03-11T11:06:11.064Z',
          updatedAt: '2022-03-11T11:06:11.064Z',
        },
      },
      {
        id: 'ecdda583-c13e-4cc4-b49a-5a9950f10963',
        name: 'secrétaire médical',
        prefix: 'comme',
        order: 0,
        CVAmbition: {
          id: '7fe9a002-6077-4004-b178-434fe3cb9f37',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          AmbitionId: 'ecdda583-c13e-4cc4-b49a-5a9950f10963',
          createdAt: '2022-03-11T11:06:11.064Z',
          updatedAt: '2022-03-11T11:06:11.064Z',
        },
      },
    ],
    businessLines: [
      {
        id: '2ede9518-7e54-444a-940d-d970d64e4fe1',
        name: 'aa',
        order: 1,
        CVBusinessLine: {
          id: '4abf84d2-22da-451c-88b4-151b2a0672a1',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          BusinessLineId: '2ede9518-7e54-444a-940d-d970d64e4fe1',
          createdAt: '2022-03-11T11:06:11.066Z',
          updatedAt: '2022-03-11T11:06:11.066Z',
        },
      },
      {
        id: 'e41bb365-5645-466d-893b-74be74841371',
        name: 'art',
        order: 0,
        CVBusinessLine: {
          id: '5137e32e-0e64-428a-862b-f84999e7c4a3',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          BusinessLineId: 'e41bb365-5645-466d-893b-74be74841371',
          createdAt: '2022-03-11T11:06:11.066Z',
          updatedAt: '2022-03-11T11:06:11.066Z',
        },
      },
    ],
    locations: [
      {
        id: '75a6a1ec-dca4-4192-92d2-b4a05becb972',
        name: 'Seine-Saint-Denis (93)',
        CVLocation: {
          id: '7428e596-a217-4461-9bd2-de7fc00b0765',
          CVId: 'dd1a95e8-c554-4cec-8a38-72418d4e6adf',
          LocationId: '75a6a1ec-dca4-4192-92d2-b4a05becb972',
          createdAt: '2022-03-11T11:06:11.071Z',
          updatedAt: '2022-03-11T11:06:11.071Z',
        },
      },
    ],
    reviews: [
      {
        id: 'd32daade-8424-4d4e-8fb3-9dcdfb5a21b9',
        text: 'Son sérieux, sa disponibilité et ses qualités humaines sont très appréciés par les bénévoles de la bibliothèque comme par les personnes accueillies et contribuent au bon fonctionnement des projets d’accès à la culture du Secours Populaire.',
        status: 'Chargée de mission, Education Populaire',
        name: 'Anne Desfontaines',
      },
    ],
    experiences: [
      {
        id: '4d858b84-e2fc-4cd3-af03-787533c8434b',
        description:
          'Participation au projet "Points Témoins" au Quai Branly - partage d\'un témoignage sur sa culture d\'origine',
        order: 0,
        skills: [],
      },
      {
        id: '89754522-f834-4cbf-a3ab-7c974e33033e',
        description: "Bénévole dans l'hôpital de Nouakchott (assistance)",
        order: 1,
        skills: [],
      },
      {
        id: '4c0eaf8d-f809-431a-ac0d-6cd44d9b4053',
        description:
          'Vente sur les marchés à Nouakchott (alimentaire) et en Gambie',
        order: 2,
        skills: [],
      },
      {
        id: '194ff2db-6b59-4bcf-a7ce-e8f990867421',
        description: 'Formation en bureautique',
        order: 3,
        skills: [],
      },
      {
        id: '9c87b973-30f8-4a95-8609-37d891710e9e',
        description:
          "- Chargé d'accueil à et gestion du courrier à la Défense chez Eurogem\n- Chargé d'accueil dans plusieurs centres d'action sociale à Paris\n- Chargé d'accueil au centre d'aide des réfugiés de Buzenval (réception des appels, accueil du public, orientation des personnes...)\n- Bénévole en accueil à la bibliothèque du Secours Populaire, Espace Ramey, Paris)",
        order: 4,
        skills: [],
      },
      {
        id: 'f1960c53-a69d-454d-98d3-18e2a9d4509b',
        description: 'Vendeuse à Carrefour ',
        order: 5,
        skills: [],
      },
    ],
  };

  return JSON.stringify(cvRead, null, 2);
};
