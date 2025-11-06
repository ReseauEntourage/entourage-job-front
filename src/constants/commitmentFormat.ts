export enum CommitmentFormatMode {
  ONLINE = 'online',
  ONSITE = 'onsite',
}

export interface CommitmentFormat {
  id: number;
  title: string;
  mode: CommitmentFormatMode;
  duration: string;
  participants: string;
  description: string;
  price: string;
  image: string;
}

export const COMMITMENT_FORMATS: CommitmentFormat[] = [
  {
    id: 1,
    title: 'Sensibilisation au monde de la rue',
    mode: CommitmentFormatMode.ONLINE,
    duration: '3 heures',
    participants: 'Entre 12 et 100 collaborateurs',
    description:
      'Faciliter et encourager l’échange avec des personnes sans domicile fixe',
    price: '3 000 € HT',
    image: '/static/img/commitment-format/sensibilisation.jpg',
  },
  {
    id: 2,
    title: 'Jeu de piste urbain solidaire',
    mode: CommitmentFormatMode.ONSITE,
    duration: '3 heures',
    participants: 'entre 12 et 35 collaborateurs',
    description: 'Découvrir autrement le quotidien des plus exclus',
    price: '3 000 € HT',
    image: '/static/img/commitment-format/jeu-piste.png',
  },
  {
    id: 3,
    title: 'Atelier sportif',
    mode: CommitmentFormatMode.ONSITE,
    duration: '3 heures (Sensibilisation + jeux sportifs + debrief)',
    participants: '20 collaborateurs (40 participants)',
    description:
      'Se rencontrer différemment et créer du lien simplement avec les personnes en précarité présentes',
    price: '3 000 € HT',
    image: '/static/img/commitment-format/atelier-sportif.png',
  },
  {
    id: 4,
    title: 'Rencontres collaborateurs',
    mode: CommitmentFormatMode.ONSITE,
    duration: '3 heures',
    participants: 'entre 12 et 35 collaborateurs',
    description:
      'Engager vos collaborateurs dans des réseaux de solidarité professionnels pour encourager le retour à l’emploi des plus exclus.',
    price: '3 000 € HT',
    image: '/static/img/commitment-format/rencontres-collabs.jpg',
  },
];
