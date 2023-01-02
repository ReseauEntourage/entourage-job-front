export const allCTAs = {
  apply: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'contactEmail',
    text: 'Je postule',
  },
  applied: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToApplied',
    text: "J'ai déjà postulé",
  },
  notInterested: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'archive',
    text: 'Je ne suis pas intéressé',
  },
  resend: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'contactRelance',
    text: "Je veux relancer l'entreprise",
  },
  gotInterview: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToInterview',
    text: "J'ai décroché un entretien",
  },
  abandon: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'abandon',
    text: "J'abandonne cette offre",
  },
  dateInterview: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "Je note une date d'entretien",
  },
  gotJob: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToHired',
    text: "J'ai décroché le job",
  },
  dateBegin: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "Je note ma date d'embauche",
  },
  trialValidated: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "J'ai validé ma période d'essai",
  },
  trialUnvalidated: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "Je n'ai pas validé la période d'essai",
  },
  feedback: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: () => {},
    text: 'Je demande un retour du recruteur',
  },
};

export const CTAsByTab = [
  {
    tab: 0,
    ctas: ['apply', 'applied', 'notInterested'],
  },
  {
    tab: 1,
    ctas: ['resend', 'gotInterview', 'abandon'],
  },
  {
    tab: 2,
    ctas: [
      // 'dateInterview',
      'gotJob',
      'abandon',
    ],
  },
  {
    tab: 3,
    ctas: ['feedback'],
  },
  {
    tab: 4,
    ctas: [
      // 'dateBegin',
      // 'trialValidated',
      // 'trialUnvalidated'
    ],
  },
];
