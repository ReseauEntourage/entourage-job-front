import _ from 'lodash';
import {
  ADMIN_ZONES,
  ADMIN_ZONES_FILTERS,
  REGIONS_FILTERS,
} from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';
import { GENDERS_FILTERS } from './genders';
import { Filter, FilterConstant } from './utils';

export { PUSHER_CHANNELS, PUSHER_EVENTS, getPusher } from './pusher';

export const PROFILES_LIMIT = 25;

export const EVENTS_LIMIT = 25;

export const COMPANIES_LIMIT = 25;

export const JNSPR = {
  value: 'jnspr',
  label: 'Je ne souhaite pas répondre',
};

export type Contract =
  | 'cdi'
  | 'cdd'
  | 'cdd+6'
  | 'cdd-6'
  | 'cddi'
  | 'alt'
  | 'inte'
  | 'stage'
  | 'form'
  | 'pmsmp'
  | 'other';

export const CONTRACTS: (FilterConstant<Contract> & {
  end: boolean;
})[] = [
  {
    label: 'CDI',
    value: 'cdi',
    end: false,
  },
  {
    label: 'CDD + de 6 mois',
    value: 'cdd+6',
    end: true,
  },
  {
    label: 'CDD - de 6 mois',
    value: 'cdd-6',
    end: true,
  },
  {
    label: "Contrat d'insertion",
    value: 'cddi',
    end: true,
  },
  {
    label: 'Alternance',
    value: 'alt',
    end: true,
  },
  {
    label: 'Intérim',
    value: 'inte',
    end: true,
  },
  {
    label: 'Stage',
    value: 'stage',
    end: true,
  },
  {
    label: 'Formation certifiante',
    value: 'form',
    end: true,
  },
  {
    label: "Période d'immersion (PMSMP)",
    value: 'pmsmp',
    end: true,
  },
  {
    label: 'Autre',
    value: 'other',
    end: true,
  },
];

export const CV_FILTERS_DATA: Filter[] = [
  {
    key: 'employed',
    type: 'checkbox',
    constants: [
      { label: "Recherche d'emploi", value: false },
      { label: 'En emploi', value: true },
    ],
    title: 'Masquer les candidats en emploi',
    tag: GA_TAGS.PAGE_GALERIE_FILTRE_EMPLOYE_CLIC,
  },
  {
    key: 'locations',
    constants: REGIONS_FILTERS,
    priority: _.orderBy(
      REGIONS_FILTERS.filter(
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ({ zone }) => {
          return zone !== ADMIN_ZONES.HZ;
        }
      ),
      'label',
      'desc'
    ),
    title: 'Où ?',
    tag: GA_TAGS.PAGE_GALERIE_FILTRE_GEOGRAPHIQUE_CLIC,
    icon: 'location',
  },
  {
    key: 'businessSectors',
    constants: [],
    title: 'Métiers',
    tag: GA_TAGS.PAGE_GALERIE_FILTRE_SECTEURS_CLIC,
  },
  {
    key: 'gender',
    constants: GENDERS_FILTERS,
    title: 'Genre',
  },
];

export const ORGANIZATION_FILTERS_DATA: Filter[] = [
  {
    key: 'zone',
    constants: ADMIN_ZONES_FILTERS,
    title: 'Zone',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_ZONE_CLIC,
  },
];

export const MEMBER_FILTERS_DATA: Filter[] = [
  {
    key: 'zone',
    constants: ADMIN_ZONES_FILTERS,
    title: 'Zone',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_ZONE_CLIC,
  },
  {
    key: 'businessSectors',
    constants: [],
    title: 'Métiers',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_SECTEUR_CLIC,
  },
  {
    key: 'employed',
    constants: [
      { label: 'En emploi', value: true },
      { label: "Recherche d'emploi", value: false },
    ],
    title: 'En emploi',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_EMPLOYE_CLIC,
  },
];

export const EXTERNAL_LINKS = {
  LKO_VG: 'https://www.linkedout-vendeeglobe.com',
  LKO_VG_CONTEST: 'https://www.linkedout-vendeeglobe.com/vendeearctique',
  LKO_BLOG: 'https://entourage.social/blog',
  ENTOURAGE: 'https://www.entourage.social',
  ARTICLE_BC: 'https://blog.entourage.social/2020/06/22/benevole-coach/',
  ARTICLE_TJV:
    'https://entourage.social/blog/le-bateau-linkedout-vainqueur-de-la-transat-jacques-vabre',
  ARTICLE_RDR:
    'https://entourage.social/blog/retour-sur-le-week-end-de-depart-de-la-route-du-rhum',
  CAMPUS_INCLUSION: 'https://campus-inclusion.fr',
  FRANCE_UNE_CHANCE:
    'https://lafrance-unechance.fr/carte-des-clubs-la-france-une-chance/',
  REPAIRS_75: 'https://www.repairs75.org/',
  REDSTAR:
    'https://entourage.social/blog/apres-la-voile-le-foot-linkedout-nouveau-partenaire-maillot-du-red-star-fc-avec-le-soutien-de-randstad',
  RECRUITMENTS: 'https://www.welcometothejungle.com/fr/companies/entourage',
  TAX: 'https://www.entourage.social/lataxequifaitplaiz',
};

export const NEWSLETTER_TAGS = {
  ZONE: [
    {
      label: 'Région parisienne',
      tag: ADMIN_ZONES.PARIS,
    },
    {
      label: 'Région lyonnaise',
      tag: ADMIN_ZONES.LYON,
    },
    {
      label: 'Région lilloise',
      tag: ADMIN_ZONES.LILLE,
    },
    {
      label: 'Région rennaise',
      tag: ADMIN_ZONES.RENNES,
    },
    {
      label: 'Lorient',
      tag: ADMIN_ZONES.LORIENT,
    },
    {
      label: 'Autre',
      tag: ADMIN_ZONES.HZ,
    },
  ],
  STATUS: [
    {
      label: 'un particulier',
      tag: 'PARTICULIER',
    },
    {
      label: 'une entreprise',
      tag: 'ENTREPRISE',
    },
    {
      label: "une structure d'insertion",
      tag: 'ASSOCIATION',
    },
    {
      label: 'un candidat potentiel',
      tag: 'CANDIDAT',
    },
  ],
};

export const STORAGE_KEYS = {
  RELEASE_VERSION: 'release-version',
  ACCESS_TOKEN: 'access-token',
  TAX_MODAL_CLOSED: 'tax-modal-closed',
  ENTOURAGE_PRO_MODAL_CLOSED: 'entourage-pro-modal-closed',
  PINNED_COMMUNICATION_CLOSED: 'pinned-communication-closed',
};

export const SOCKETS = {
  CHANNEL_NAMES: {
    CV_PREVIEW: 'cv-preview-channel',
    CV_PDF: 'cv-pdf-channel',
  },
  EVENTS: {
    CV_PREVIEW_DONE: 'cv-preview-done',
    CV_PDF_DONE: 'cv-pdf-done',
  },
};

export const VALUES = { SHARES: 120000 + 64000 };

export const CONTACT_INFO = {
  CORPORATE_CONTACT: 'barnabe@entourage.social',
  MAIN_PHONE_NUMBER: '01 88 24 70 70',
  MOBILE_PHONE_NUMBER: '07 82 44 97 39',
};

export const INITIAL_NB_OF_CV_TO_DISPLAY = 9;

export const HeardAbout = {
  COMPANY: 'company',
  ENTOURAGE: 'entourage',
  PRESS: 'press',
  LINKEDIN: 'linkedin',
  SOCIAL: 'social',
  SPORTS: 'sports',
  VOLUNTEER: 'volunteer',
  CONTACT: 'contact',
  ORIENTATION: 'orientation',
  POLE_EMPLOI: 'pole_emploi',
  OTHER: 'other',
} as const;

export type HeardAboutValue = (typeof HeardAbout)[keyof typeof HeardAbout];

export const HEARD_ABOUT_FILTERS: FilterConstant<HeardAboutValue>[] = [
  {
    label: 'Mon entreprise',
    value: HeardAbout.COMPANY,
  },
  {
    label: 'Association / travailleur social',
    value: HeardAbout.ORIENTATION,
  },
  {
    label: 'Pôle Emploi',
    value: HeardAbout.POLE_EMPLOI,
  },
  {
    label: 'Le réseau Entourage',
    value: HeardAbout.ENTOURAGE,
  },
  {
    label: 'Les médias (presse, web, TV)',
    value: HeardAbout.PRESS,
  },
  {
    label: 'LinkedIn',
    value: HeardAbout.LINKEDIN,
  },
  {
    label: 'Autres réseaux (Facebook, Twitter, Instagram...)',
    value: HeardAbout.SOCIAL,
  },
  {
    label: 'Un partenariat sportif',
    value: HeardAbout.SPORTS,
  },
  {
    label: 'Un site de bénévolat',
    value: HeardAbout.VOLUNTEER,
  },
  {
    label: 'Le bouche à oreille',
    value: HeardAbout.CONTACT,
  },
  {
    label: 'Autre',
    value: HeardAbout.OTHER,
  },
];

export const CompanyApproaches = {
  RECRUITMENT: 'recruitment',
  INFORMATION: 'information',
  MOBILIZATION: 'mobilization',
  DONATION: 'donation',
} as const;

export type CompanyApproach =
  (typeof CompanyApproaches)[keyof typeof CompanyApproaches];

export const COMPANY_APPROACHES_FILTERS: FilterConstant<CompanyApproach>[] = [
  {
    label: 'Recruter inclusif',
    value: CompanyApproaches.RECRUITMENT,
  },
  {
    label: "Avoir plus d'informations sur Entourage Pro",
    value: CompanyApproaches.INFORMATION,
  },
  {
    label: 'Mobiliser mes collaborateurs',
    value: CompanyApproaches.MOBILIZATION,
  },
  {
    label: 'Soutenir le projet (mécénat)',
    value: CompanyApproaches.DONATION,
  },
];

export const COMPANY_CONTACT_ZONES_FILTERS = [
  { value: ADMIN_ZONES.PARIS, label: _.capitalize(ADMIN_ZONES.PARIS) },
  { value: ADMIN_ZONES.LILLE, label: _.capitalize(ADMIN_ZONES.LILLE) },
  { value: ADMIN_ZONES.LYON, label: _.capitalize(ADMIN_ZONES.LYON) },
  { value: ADMIN_ZONES.LORIENT, label: _.capitalize(ADMIN_ZONES.LORIENT) },
  { value: ADMIN_ZONES.RENNES, label: _.capitalize(ADMIN_ZONES.RENNES) },
  { value: 'NATIONAL', label: 'National' },
  { value: ADMIN_ZONES.HZ, label: 'Autre région' },
];

export const CandidateHelpWith = {
  WORK: 'work',
  SOCIAL: 'social',
  ACCOMMODATION: 'accommodation',
  HEALTH: 'health',
  RIGHTS: 'rights',
  OTHER: 'other',
} as const;

export type CandidateHelpWithValue =
  (typeof CandidateHelpWith)[keyof typeof CandidateHelpWith];

export const CANDIDATE_HELP_WITH_FILTERS: FilterConstant<CandidateHelpWithValue>[] =
  [
    {
      label: 'Emploi',
      value: CandidateHelpWith.WORK,
    },
    {
      label: 'Social',
      value: CandidateHelpWith.SOCIAL,
    },
    {
      label: 'Logement',
      value: CandidateHelpWith.ACCOMMODATION,
    },
    {
      label: 'Santé',
      value: CandidateHelpWith.HEALTH,
    },
    {
      label: 'Accès aux droits',
      value: CandidateHelpWith.RIGHTS,
    },
    {
      label: 'Autre',
      value: CandidateHelpWith.OTHER,
    },
  ];

export const CandidateGenders = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export type CandidateGender =
  (typeof CandidateGenders)[keyof typeof CandidateGenders];

export const CANDIDATE_GENDERS_FILTERS: FilterConstant<CandidateGender>[] = [
  {
    label: 'Homme',
    value: CandidateGenders.MALE,
  },
  {
    label: 'Femme',
    value: CandidateGenders.FEMALE,
  },
  /* {
    label: 'Autre',
    value: CandidateGenders.OTHER,
  }, */
];

export const CandidateAdministrativeSituations = {
  ID_CARD_FR: 'id_card_fr',
  PASSPORT: 'passport',
  RESIDENCE_PERMIT: 'residence_permit',
  RESIDENCE_PERMIT_RECEIPT: 'residence_permit_receipt',
  RESIDENT_CARD: 'resident_card',
  ASYLUM: 'asylum',
  ASYLUM_DISMISSED: 'asylum_dismissed',
} as const;

export type CandidateAdministrativeSituation =
  (typeof CandidateAdministrativeSituations)[keyof typeof CandidateAdministrativeSituations];

export const CANDIDATE_ADMINISTRATIVE_SITUATIONS_FILTERS: FilterConstant<CandidateAdministrativeSituation>[] =
  [
    {
      value: CandidateAdministrativeSituations.ID_CARD_FR,
      label: "Carte nationale d'identité Française",
    },
    {
      value: CandidateAdministrativeSituations.PASSPORT,
      label: 'Passeport',
    },
    {
      value: CandidateAdministrativeSituations.ASYLUM,
      label: "Demande d'asile",
    },
    {
      value: CandidateAdministrativeSituations.ASYLUM_DISMISSED,
      label: "Débouté de droit d'asile",
    },
    {
      value: CandidateAdministrativeSituations.RESIDENT_CARD,
      label: 'Carte de résident',
    },
    {
      value: CandidateAdministrativeSituations.RESIDENCE_PERMIT,
      label: 'Titre de séjour',
    },
    {
      value: CandidateAdministrativeSituations.RESIDENCE_PERMIT_RECEIPT,
      label: 'Récépissé de titre de séjour',
    },
  ];

export const CandidateAccommodations = {
  PERSONAL: 'personal',
  SOMEONE: 'someone',
  URGENCY: 'urgency',
  INSERTION: 'insertion',
  STREET: 'street',
  OTHER: 'other',
  JNSPR: JNSPR.value,
} as const;

export type CandidateAccommodation =
  (typeof CandidateAccommodations)[keyof typeof CandidateAccommodations];

export const CANDIDATE_ACCOMMODATIONS_FILTERS: FilterConstant<CandidateAccommodation>[] =
  [
    {
      value: CandidateAccommodations.PERSONAL,
      label: 'Logement personnel',
    },
    {
      value: CandidateAccommodations.SOMEONE,
      label: 'Hébergé chez un tiers (famille, amis, etc, ...)',
    },
    {
      value: CandidateAccommodations.URGENCY,
      label: "Hébergement d'urgence (CHU, hôtel...)",
    },
    {
      value: CandidateAccommodations.INSERTION,
      label:
        "Hébergement d'insertion (CHRS, FJT, Solibail, Résidence Sociale, Pension, ...)",
    },
    {
      value: CandidateAccommodations.STREET,
      label: 'Situation de rue',
    },
    {
      value: CandidateAccommodations.OTHER,
      label: 'Autre',
    },
    {
      value: CandidateAccommodations.JNSPR,
      label: JNSPR.label,
    },
  ];

export const CandidateProfessionalSituations = {
  UNEMPLOYED: 'unemployed',
  CDI: 'cdi',
  CDD: 'cdd',
  FORM: 'form',
  INTE: 'inte',
  STUDENT: 'student',
  CDDI: 'cddi',
  OTHER: 'other',
} as const;

export type CandidateProfessionalSituation =
  (typeof CandidateProfessionalSituations)[keyof typeof CandidateProfessionalSituations];

export const CANDIDATE_PROFESSIONAL_SITUATIONS_FILTERS: FilterConstant<CandidateProfessionalSituation>[] =
  [
    {
      label: 'Sans emploi',
      value: CandidateProfessionalSituations.UNEMPLOYED,
    },
    {
      label: 'CDI',
      value: CandidateProfessionalSituations.CDI,
    },
    {
      label: 'CDD',
      value: CandidateProfessionalSituations.CDD,
    },
    {
      label: 'Intérim',
      value: CandidateProfessionalSituations.INTE,
    },
    {
      label: 'Étudiant',
      value: CandidateProfessionalSituations.STUDENT,
    },
    {
      label: 'En formation',
      value: CandidateProfessionalSituations.FORM,
    },
    {
      label: "Contrat d'insertion",
      value: CandidateProfessionalSituations.CDDI,
    },
    {
      label: 'Autre',
      value: CandidateProfessionalSituations.OTHER,
    },
  ];

export const CandidateResources = {
  SALARY: 'salary',
  UNEMPLOYMENT: 'unemployment',
  AAH: 'aah',
  RSA: 'rsa',
  INVALIDITY: 'invalidity',
  OTHER: 'other',
  NONE: 'none',
  JNSPR: JNSPR.value,
} as const;

export type CandidateResource =
  (typeof CandidateResources)[keyof typeof CandidateResources];

export const CANDIDATE_RESOURCES_FILTERS: FilterConstant<CandidateResource>[] =
  [
    {
      label: 'Salaire',
      value: CandidateResources.SALARY,
    },
    {
      label: 'Allocation chômage',
      value: CandidateResources.UNEMPLOYMENT,
    },
    {
      label: 'Allocation Adulte Handicapé',
      value: CandidateResources.AAH,
    },
    {
      label: 'RSA',
      value: CandidateResources.RSA,
    },
    {
      label: "Pension d'invalidité",
      value: CandidateResources.INVALIDITY,
    },
    {
      label: 'Autre',
      value: CandidateResources.OTHER,
    },
    {
      label: 'Aucune',
      value: CandidateResources.NONE,
    },
    {
      label: JNSPR.label,
      value: CandidateResources.JNSPR,
    },
  ];

export const CandidateYesNo = {
  YES: 'yes',
  NO: 'no',
} as const;

export type CandidateYesNoValue =
  (typeof CandidateYesNo)[keyof typeof CandidateYesNo];
export const CANDIDATE_YES_NO_FILTERS: FilterConstant<CandidateYesNoValue>[] = [
  {
    value: CandidateYesNo.YES,
    label: 'Oui',
  },
  {
    value: CandidateYesNo.NO,
    label: 'Non',
  },
];

export const CandidateYesNoNSPP = {
  ...CandidateYesNo,
  NSPP: 'dont_know',
} as const;

export type CandidateYesNoNSPPValue =
  (typeof CandidateYesNoNSPP)[keyof typeof CandidateYesNoNSPP];

export const CANDIDATE_YES_NO_NSPP_FILTERS: FilterConstant<CandidateYesNoNSPPValue>[] =
  [
    {
      value: CandidateYesNo.YES,
      label: 'Oui',
    },
    {
      value: CandidateYesNo.NO,
      label: 'Non',
    },
    {
      label: 'Je ne sais pas',
      value: CandidateYesNoNSPP.NSPP,
    },
  ];

export const YesNoJNSPR = {
  ...CandidateYesNo,
  JNSPR: JNSPR.value,
} as const;

export type YesNoJNSPRValue = (typeof YesNoJNSPR)[keyof typeof YesNoJNSPR];

export const YES_NO_JNSPR_FILTERS: FilterConstant<YesNoJNSPRValue>[] = [
  {
    value: YesNoJNSPR.YES,
    label: 'Oui',
  },
  {
    value: YesNoJNSPR.NO,
    label: 'Non',
  },
  {
    value: YesNoJNSPR.JNSPR,
    label: JNSPR.label,
  },
];

export const EVENT_TYPES = {
  CONTACT: 'contact',
  FOLLOWUP: 'followup',
  INTERVIEW: 'interview',
  TRIAL: 'trial',
  PMSMP: 'pmsmp',
  HIRING: 'hiring',
  END: 'end',
};

export const EVENT_TYPES_FILTERS = [
  {
    label: 'Contacté le',
    value: EVENT_TYPES.CONTACT,
  },
  {
    label: 'Relancé le',
    value: EVENT_TYPES.FOLLOWUP,
  },
  {
    label: 'Entretien le',
    value: EVENT_TYPES.INTERVIEW,
  },
  {
    label: "Période d'essai le",
    value: EVENT_TYPES.TRIAL,
  },
  {
    label: 'PMSMP le',
    value: EVENT_TYPES.PMSMP,
  },
  {
    label: 'Embauché le',
    value: EVENT_TYPES.HIRING,
  },
  {
    label: 'Arrêt de contrat le',
    value: EVENT_TYPES.END,
  },
];

export const ANTENNE_INFO = [
  {
    dpt: '93',
    city: 'Paris',
    address: process.env.NEXT_PUBLIC_LOCAL_BRANCH_ADDRESS_PARIS,
  },
  {
    dpt: '75',
    city: 'Paris',
    address: process.env.NEXT_PUBLIC_LOCAL_BRANCH_ADDRESS_PARIS,
  },
  {
    dpt: '92',
    city: 'Paris',
    address: process.env.NEXT_PUBLIC_LOCAL_BRANCH_ADDRESS_PARIS,
  },
  {
    dpt: '35',
    city: 'Rennes',
    address: process.env.NEXT_PUBLIC_LOCAL_BRANCH_ADDRESS_RENNES,
  },
  {
    dpt: '59',
    city: 'Lille',
    address: process.env.NEXT_PUBLIC_LOCAL_BRANCH_ADDRESS_LILLE,
  },
  {
    dpt: '69',
    city: 'Lyon',
    address: process.env.NEXT_PUBLIC_LOCAL_BRANCH_ADDRESS_LYON,
  },
] as const;

export const MEMBER_TABS = {
  CV: 'cv',
  PARAMETERS: 'parametres',
};

export const ReduxRequestEvents = {
  REQUESTED: 'REQUESTED',
  SUCCEEDED: 'SUCCEEDED',
  IDLE: 'IDLE',
  FAILED: 'FAILED',
} as const;

export type DocumentNameType = 'CharteEthique' | 'ConseilsPosture';

export const DocumentNames: { [k in DocumentNameType]: DocumentNameType } = {
  CharteEthique: 'CharteEthique',
  ConseilsPosture: 'ConseilsPosture',
};

export const Nationalities = {
  FRENCH: 'french',
  EUROPEAN: 'european',
  EXTRA_EUROPEAN: 'extra_european',
  STATELESS: 'stateless',
  JNSPR: JNSPR.value,
} as const;
export type Nationality = (typeof Nationalities)[keyof typeof Nationalities];

export const NATIONALITIES_FILTERS: FilterConstant<Nationality>[] = [
  {
    label: 'française',
    value: Nationalities.FRENCH,
  },
  {
    label: 'européenne',
    value: Nationalities.EUROPEAN,
  },
  {
    label: 'extra-européenne',
    value: Nationalities.EXTRA_EUROPEAN,
  },
  {
    label: 'apatride',
    value: Nationalities.STATELESS,
  },
  {
    label: JNSPR.label,
    value: Nationalities.JNSPR,
  },
];

export const JobSearchDurations = {
  LESS_THAN_3_MONTHS: 'less_than_3_months',
  BETWEEN_3_AND_6_MONTHS: 'between_3_and_6_months',
  BETWEEN_6_AND_12_MONTHS: 'between_6_and_12_months',
  BETWEEN_12_AND_24_MONTHS: 'between_12_and_24_months',
  BETWEEN_24_AND_36_MONTHS: 'between_24_and_36_months',
  MORE_THAN_36_MONTHS: 'more_than_36_months',
  JNSPR: JNSPR.value,
} as const;

export type JobSearchDuration =
  (typeof JobSearchDurations)[keyof typeof JobSearchDurations];

export const JOB_SEARCH_DURATIONS_FILTERS: FilterConstant<JobSearchDuration>[] =
  [
    {
      label: 'Moins de 3 mois',
      value: JobSearchDurations.LESS_THAN_3_MONTHS,
    },
    {
      label: 'Entre 3 et 6 mois',
      value: JobSearchDurations.BETWEEN_3_AND_6_MONTHS,
    },
    {
      label: 'Entre 6 et 12 mois',
      value: JobSearchDurations.BETWEEN_6_AND_12_MONTHS,
    },
    {
      label: 'Entre 12 et 24 mois',
      value: JobSearchDurations.BETWEEN_12_AND_24_MONTHS,
    },
    {
      label: 'Entre 24 et 36 mois',
      value: JobSearchDurations.BETWEEN_24_AND_36_MONTHS,
    },
    {
      label: 'Plus de 36 mois',
      value: JobSearchDurations.MORE_THAN_36_MONTHS,
    },
    {
      label: JNSPR.label,
      value: JobSearchDurations.JNSPR,
    },
  ];

export const StudiesLevels = {
  NONE: 'none',
  CAP_BEP: 'cap_bep',
  BAC: 'bac',
  BAC_PLUS_2: 'bac_plus_2',
  BAC_PLUS_3: 'bac_plus_3',
  BAC_PLUS_5: 'bac_plus_5',
  BAC_PLUS_8: 'bac_plus_8',
  JNSPR: JNSPR.value,
} as const;

export type StudiesLevel = (typeof StudiesLevels)[keyof typeof StudiesLevels];

export const STUDIES_LEVELS_FILTERS: FilterConstant<StudiesLevel>[] = [
  {
    label: 'Aucun',
    value: StudiesLevels.NONE,
  },
  {
    label: 'CAP/BEP',
    value: StudiesLevels.CAP_BEP,
  },
  {
    label: 'Bac',
    value: StudiesLevels.BAC,
  },
  {
    label: 'Bac +2',
    value: StudiesLevels.BAC_PLUS_2,
  },
  {
    label: 'Bac +3',
    value: StudiesLevels.BAC_PLUS_3,
  },
  {
    label: 'Bac +5',
    value: StudiesLevels.BAC_PLUS_5,
  },
  {
    label: 'Bac +8',
    value: StudiesLevels.BAC_PLUS_8,
  },
  {
    label: JNSPR.label,
    value: StudiesLevels.JNSPR,
  },
];

export const WorkingExperienceYears = {
  LESS_THAN_1_YEAR: 'less_than_3_year',
  BETWEEN_1_AND_3_YEARS: 'between_3_and_10_years',
  MORE_THAN_10_YEARS: 'more_than_10_years',
  JNSPR: JNSPR.value,
};

export type WorkingExperience =
  (typeof WorkingExperienceYears)[keyof typeof WorkingExperienceYears];

export const WORKING_EXPERIENCE_FILTERS: FilterConstant<WorkingExperience>[] = [
  {
    label: 'Moins de 3 ans',
    value: WorkingExperienceYears.LESS_THAN_1_YEAR,
  },
  {
    label: 'Entre 3 et 10 ans',
    value: WorkingExperienceYears.BETWEEN_1_AND_3_YEARS,
  },
  {
    label: 'Plus de 10 ans',
    value: WorkingExperienceYears.MORE_THAN_10_YEARS,
  },
  {
    label: JNSPR.label,
    value: WorkingExperienceYears.JNSPR,
  },
];

export const DELAY_REFRESH_CONVERSATIONS = 30000;

export const LANGUAGES_LEVELS = [
  {
    value: 'NOTIONS',
    text: 'Notions',
  },
  {
    value: 'INTERMEDIATE',
    text: 'Niveau intermédiaire',
  },
  {
    value: 'FLUENT',
    text: 'Niveau courant',
  },
  {
    value: 'NATIVE',
    text: 'Langue maternelle',
  },
];
