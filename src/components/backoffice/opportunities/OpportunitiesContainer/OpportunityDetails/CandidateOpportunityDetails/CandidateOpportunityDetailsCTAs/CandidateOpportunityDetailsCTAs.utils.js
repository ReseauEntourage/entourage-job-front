export const allCTAs = {
  apply: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: () => {},
    text: 'Je postule',
  },
  applied: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "J'ai déjà postulé",
  },
  notInterested: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: () => {},
    text: 'Je ne suis pas intéressé',
  },
  resend: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "Je veux relancer l'entreprise",
  },
  gotInterview: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "J'ai décroché un entretien",
  },
  abandon: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: () => {},
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
    action: () => {},
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
    ctas: ['resend', 'gotInterview', 'notInterested'],
  },
  {
    tab: 2,
    ctas: ['dateInterview', 'gotJob', 'abandon'],
  },
  {
    tab: 4,
    ctas: ['dateBegin', 'trialValidated', 'trialUnvalidated'],
  },
  {
    tab: 3,
    ctas: ['feedback'],
  },
];
