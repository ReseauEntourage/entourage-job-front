import _ from 'lodash';
import {
  ADMIN_ZONES,
  ADMIN_ZONES_FILTERS,
  DEPARTMENTS_FILTERS,
  REGIONS_FILTERS,
} from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';

import { ProfileCardHelps } from './helps';
import { GENDERS_FILTERS, USER_ROLES_FILTERS } from './users';
import { FilterConstant } from './utils';

export type OfferStatus = -1 | 0 | 1 | 2 | 3 | 4;

export const OFFER_STATUS: (FilterConstant<OfferStatus> & {
  color: string;
  public?: string;
  recommended?: string;
})[] = [
  {
    value: -1,
    label: 'Offre à traiter',
    public: 'Offre consultée',
    recommended: 'Offre recommandée',
    color: 'muted',
  },
  { value: 0, label: 'Contacté', color: 'muted' },
  { value: 1, label: "Phase d'entretien", color: 'warning' },
  { value: 2, label: 'Embauche', color: 'success' },
  { value: 3, label: 'Refus avant entretien', color: 'danger' },
  { value: 4, label: 'Refus après entretien', color: 'danger' },
];

export type AdminOffersTags = 'pending' | 'validated' | 'external' | 'archived';

export const ADMIN_OFFERS_TAGS: FilterConstant<AdminOffersTags>[] = [
  {
    value: 'pending',
    label: 'offres à valider',
  },
  {
    value: 'validated',
    label: 'offres publiées',
  },
  {
    value: 'external',
    label: 'offres externes',
  },
  {
    value: 'archived',
    label: 'offres archivées',
  },
];

export type BusinessLineValue =
  | 'la'
  | 'aa'
  | 'bat'
  | 'rh'
  | 'cd'
  | 'asp'
  | 'pr'
  | 'mi'
  | 'art'
  | 'tra'
  | 'id'
  | 'sec'
  | 'cm'
  | 'ca'
  | 'aev'
  | 'sa'
  | 'fjr'
  | 'sm';

const BUSINESS_LINES_UNSORTED: (FilterConstant<BusinessLineValue> & {
  prefix: string | string[];
})[] = [
  {
    label: 'Logistique et approvisionnement',
    value: 'la',
    prefix: ['la', "l'"],
  },
  {
    label: 'Assistanat et administratif',
    value: 'aa',
    prefix: ["l'", "l'"],
  },
  {
    label: 'Bâtiment',
    value: 'bat',
    prefix: 'le',
  },
  {
    label: 'Restauration et hôtellerie',
    value: 'rh',
    prefix: ['la', "l'"],
  },
  {
    label: 'Commerce et distribution',
    value: 'cd',
    prefix: ['le', 'la'],
  },
  {
    label: 'Aide et service à la personne',
    value: 'asp',
    prefix: ["l'", 'le'],
  },
  {
    label: 'Propreté',
    value: 'pr',
    prefix: 'la',
  },
  {
    label: 'Maintenance et industrie',
    value: 'mi',
    prefix: ['la', "l'"],
  },
  {
    label: 'Artisanat',
    value: 'art',
    prefix: "l'",
  },
  {
    label: 'Transport',
    value: 'tra',
    prefix: 'le',
  },
  {
    label: 'Informatique et digital',
    value: 'id',
    prefix: ["l'", 'le'],
  },
  {
    label: 'Sécurité',
    value: 'sec',
    prefix: 'la',
  },
  {
    label: 'Communication et marketing',
    value: 'cm',
    prefix: ['la', 'le'],
  },
  {
    label: 'Culture et art',
    value: 'ca',
    prefix: ['la', "l'"],
  },
  {
    label: 'Agriculture et espaces verts',
    value: 'aev',
    prefix: ["l'", 'les'],
  },
  {
    label: 'Social et associatif',
    value: 'sa',
    prefix: ['le', "l'"],
  },
  {
    label: 'Direction financière, juridique et ressources humaines',
    value: 'fjr',
    prefix: ['la', 'les'],
  },
  {
    label: 'Santé et médical',
    value: 'sm',
    prefix: ['la', 'le'],
  },
];

export const BUSINESS_LINES = BUSINESS_LINES_UNSORTED.sort(
  ({ label: labelA }, { label: labelB }) => {
    return labelA.localeCompare(labelB);
  }
) as typeof BUSINESS_LINES_UNSORTED;

export const CV_STATUS = {
  Published: {
    label: 'Publié',
    value: 'Published',
    style: 'success',
  },
  Pending: {
    label: 'En attente',
    value: 'Pending',
    style: 'danger',
  },
  Progress: {
    label: 'En cours',
    value: 'Progress',
    style: 'muted',
  },
  New: {
    label: 'Nouveau',
    value: 'New',
    style: 'muted',
  },
  Draft: {
    label: 'Brouillon',
    value: 'Draft',
    style: 'warning',
  },
  Unknown: {
    label: 'Inconnu',
    value: 'Unknown',
    style: '',
  },
};

export type AmbitionsPrefixesType = 'dans' | 'comme';

export const AMBITIONS_PREFIXES: {
  label: AmbitionsPrefixesType;
  value: AmbitionsPrefixesType;
}[] = [
  {
    label: 'dans',
    value: 'dans',
  },
  {
    label: 'comme',
    value: 'comme',
  },
];

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

export const OFFER_ADMIN_FILTERS_DATA = [
  { tag: 'pending', title: 'Offres à valider' },
  { tag: 'validated', title: 'Offres publiées', active: true },
  { tag: 'external', title: 'Offres externes' },
  { tag: 'archived', title: 'Offres archivées' },
];

export const CV_FILTERS_DATA = [
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
    key: 'businessLines',
    constants: BUSINESS_LINES,
    title: 'Métiers',
    tag: GA_TAGS.PAGE_GALERIE_FILTRE_SECTEURS_CLIC,
  },
  {
    key: 'gender',
    constants: GENDERS_FILTERS,
    title: 'Genre',
  },
];

export const OPPORTUNITY_FILTERS_DATA = [
  {
    key: 'isPublic',
    constants: [
      { label: 'Offres privées', value: false },
      { label: 'Offres générales', value: true },
    ],
    title: 'Privée/générale',
    tag: GA_TAGS.BACKOFFICE_OFFRES_FILTRE_PUBLIQUE_CLIC,
  },
  {
    key: 'status',
    constants: OFFER_STATUS,
    title: 'Statut',
    tag: GA_TAGS.BACKOFFICE_OFFRES_FILTRE_STATUT_CLIC,
  },
  {
    key: 'department',
    constants: DEPARTMENTS_FILTERS,
    priority: DEPARTMENTS_FILTERS.filter((dept) => {
      return dept.zone !== ADMIN_ZONES.HZ;
    }),
    title: 'Département',
    tag: GA_TAGS.BACKOFFICE_OFFRES_FILTRE_GEOGRAPHIQUE_CLIC,
  },
  {
    key: 'businessLines',
    constants: BUSINESS_LINES,
    title: 'Métiers',
    tag: GA_TAGS.BACKOFFICE_OFFRES_FILTRE_SECTEUR_CLIC,
  },
  {
    key: 'contracts',
    constants: CONTRACTS,
    title: 'Type de contrat',
    tag: GA_TAGS.BACKOFFICE_OFFRES_FILTRE_CONTRAT_CLIC,
  },
];

export const ORGANIZATION_FILTERS_DATA = [
  {
    key: 'zone',
    constants: ADMIN_ZONES_FILTERS,
    title: 'Zone',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_ZONE_CLIC,
  },
];

export const DIRECTORY_FILTERS_DATA = [
  {
    key: 'departments',
    constants: DEPARTMENTS_FILTERS,
    title: 'Département',
    tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_DEPARTEMENT_CLIC,
  },
  {
    key: 'helps',
    constants: ProfileCardHelps,
    title: "Type d'aide",
    tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_AIDE_CLIC,
  },
  {
    key: 'businessLines',
    constants: BUSINESS_LINES,
    title: "Secteur d'activité",
    tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_AIDE_CLIC,
  },
];

export const MEMBER_FILTERS_DATA = [
  {
    key: 'role',
    constants: USER_ROLES_FILTERS,
    title: 'Type',
    mandatory: true,
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_TYPE_CLIC,
  },
  {
    key: 'zone',
    constants: ADMIN_ZONES_FILTERS,
    title: 'Zone',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_ZONE_CLIC,
  },
  {
    key: 'businessLines',
    constants: BUSINESS_LINES,
    title: 'Métiers',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_SECTEUR_CLIC,
  },
  {
    key: 'associatedUser',
    constants: [
      { label: 'Binôme en cours', value: true },
      { label: 'Sans binôme', value: false },
    ],
    title: 'Membre associé',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_BINOME_CLIC,
  },
  {
    key: 'hidden',
    constants: [
      { label: 'CV masqués', value: true },
      { label: 'CV visibles', value: false },
    ],
    title: 'CV masqué',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_MASQUE_CLIC,
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
  {
    key: 'cvStatus',
    constants: [
      CV_STATUS.Published,
      CV_STATUS.Pending,
      CV_STATUS.Progress,
      CV_STATUS.New,
    ],
    title: 'Statut du CV',
    tag: GA_TAGS.BACKOFFICE_MEMBERS_FILTRE_STATUT_CV_CLIC,
  },
] as const;

export type MEMBER_FILTERS_CONSTANT = (typeof MEMBER_FILTERS_DATA)[number];

export type ExternalOfferOrigin = 'network' | 'internet' | 'counselor';

export const EXTERNAL_OFFERS_ORIGINS: FilterConstant<ExternalOfferOrigin>[] = [
  {
    label: 'Mon réseau',
    value: 'network',
  },
  {
    label: 'Recherches Internet',
    value: 'internet',
  },
  {
    label: 'Mon conseiller emploi (Pôle Emploi, mission locale...)',
    value: 'counselor',
  },
];

export const EXTERNAL_LINKS = {
  LKO_VG: 'https://www.linkedout-vendeeglobe.com',
  LKO_VG_CONTEST: 'https://www.linkedout-vendeeglobe.com/vendeearctique',
  LKO_BLOG: 'https://blog.linkedout.fr',
  ENTOURAGE: 'https://www.entourage.social',
  LEGAL_MENTIONS:
    'https://docs.google.com/document/d/1a1IU9Y6qVDr4pvWJRE5XMVZ2fNhg0rhXMTL_lqY_f1M/pub',
  ARTICLE_BC: 'https://blog.entourage.social/2020/06/22/benevole-coach/',
  ARTICLE_TJV:
    'https://blog.linkedout.fr/2021/11/25/le-bateau-linkedout-vainqueur-de-la-transat-jacques-vabre/',
  ARTICLE_RDR:
    'https://blog.linkedout.fr/2022/11/23/retour-sur-le-week-end-de-depart-de-la-route-du-rhum/',
  CAMPUS_INCLUSION: 'https://campus-inclusion.fr',
  FRANCE_UNE_CHANCE:
    'https://lafrance-unechance.fr/carte-des-clubs-la-france-une-chance/',
  REPAIRS_75: 'https://www.repairs75.org/',
  REDSTAR:
    'https://blog.linkedout.fr/2021/07/21/apres-la-voile-le-foot-linkedout-nouveau-partenaire-maillot-du-red-star-fc-avec-le-soutien-de-randstad/',
  RECRUITMENTS: 'https://www.welcometothejungle.com/fr/companies/entourage',
  TAX: 'https://taxe-apprentissage.linkedout.fr',
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
    label: "Avoir plus d'informations sur LinkedOut",
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
      label: 'Rue ou abri de fortune (squat, voiture, camping...)',
    },
    {
      value: CandidateAccommodations.OTHER,
      label: 'Autre',
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
      label: 'AAH',
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
  YES: 'yes',
  NO: 'no',
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

export const EVENT_TYPES = {
  CONTACT: 'contact',
  FOLLOWUP: 'followup',
  INTERVIEW: 'interview',
  TRIAL: 'trial',
  PMSMP: 'pmsmp',
  HIRING: 'hiring',
  END: 'end',
};

export const EVENT_TYPE_MAPPING = {
  [OFFER_STATUS[1].value]: EVENT_TYPES.CONTACT,
  [OFFER_STATUS[2].value]: EVENT_TYPES.INTERVIEW,
  [OFFER_STATUS[3].value]: EVENT_TYPES.HIRING,
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

const ADDRESSES = {
  PARIS: process.env.ADRESSE_LOCAUX_PARIS,
  LYON: process.env.ADRESSE_LOCAUX_LYON,
  LILLE: process.env.ADRESSE_LOCAUX_LILLE,
  RENNES: process.env.ADRESSE_LOCAUX_RENNES,
  LORIENT: process.env.ADRESSE_LOCAUX_LORIENT,
};

export const ANTENNE_INFO = [
  {
    dpt: '93',
    mailCoordo: process.env.ADMIN_CANDIDATES_PARIS,
    mailEntreprise: process.env.ADMIN_COMPANIES_PARIS,
    city: 'Paris',
    address: ADDRESSES.PARIS,
  },
  {
    dpt: '75',
    mailCoordo: process.env.ADMIN_CANDIDATES_PARIS,
    mailEntreprise: process.env.ADMIN_COMPANIES_PARIS,
    city: 'Paris',
    address: ADDRESSES.PARIS,
  },
  {
    dpt: '92',
    mailCoordo: process.env.ADMIN_CANDIDATES_PARIS,
    mailEntreprise: process.env.ADMIN_COMPANIES_PARIS,
    city: 'Paris',
    address: ADDRESSES.PARIS,
  },
  {
    dpt: '56',
    mailCoordo: process.env.ADMIN_CANDIDATES_RENNES,
    mailEntreprise: process.env.ADMIN_COMPANIES_RENNES,
    city: 'Lorient',
    address: ADDRESSES.LORIENT,
  },
  {
    dpt: '35',
    mailCoordo: process.env.ADMIN_CANDIDATES_LORIENT,
    mailEntreprise: process.env.ADMIN_COMPANIES_LORIENT,
    city: 'Rennes',
    address: ADDRESSES.RENNES,
  },
  {
    dpt: '59',
    mailCoordo: process.env.ADMIN_CANDIDATES_LILLE,
    mailEntreprise: process.env.ADMIN_COMPANIES_LILLE,
    city: 'Lille',
    address: ADDRESSES.LILLE,
  },
  {
    dpt: '69',
    mailCoordo: process.env.ADMIN_CANDIDATES_LYON,
    mailEntreprise: process.env.ADMIN_COMPANIES_LYON,
    city: 'Lyon',
    address: ADDRESSES.LYON,
  },
] as const;

export const MEMBER_TABS = {
  CV: 'cv',
  PARAMETERS: 'parametres',
  OFFERS: 'offres',
};

export const ExternalMessageContactTypes = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  COACH_CONNECTOR: 'coach_connector',
} as const;

export type ExternalMessageContactType =
  (typeof ExternalMessageContactTypes)[keyof typeof ExternalMessageContactTypes];

export const EXTERNAL_MESSAGE_CONTACT_TYPE_FILTERS: FilterConstant<ExternalMessageContactType>[] =
  [
    {
      label: 'Un particulier',
      value: ExternalMessageContactTypes.INDIVIDUAL,
    },
    {
      label: 'Une entreprise',
      value: ExternalMessageContactTypes.COMPANY,
    },
    {
      label: 'Coach/connecteur LinkedOut',
      value: ExternalMessageContactTypes.COACH_CONNECTOR,
    },
  ];

export const ExternalMessageSubjects = {
  HIRING: 'hiring',
  HELP: 'help',
  RELATION: 'relation',
  ADVICE: 'advice',
  CHEERING: 'cheering',
  OTHER: 'other',
} as const;

export type ExternalMessageSubject =
  (typeof ExternalMessageSubjects)[keyof typeof ExternalMessageSubjects];

export const EXTERNAL_MESSAGE_SUBJECT_FILTERS: FilterConstant<ExternalMessageSubject>[] =
  [
    {
      label: "Offre d'emploi",
      value: ExternalMessageSubjects.HIRING,
    },
    {
      label: 'Coup de pouce',
      value: ExternalMessageSubjects.HELP,
    },
    {
      label: 'Mise en relation',
      value: ExternalMessageSubjects.RELATION,
    },
    {
      label: 'Conseils',
      value: ExternalMessageSubjects.ADVICE,
    },
    {
      label: 'Encouragements',
      value: ExternalMessageSubjects.CHEERING,
    },
    {
      label: 'Autre',
      value: ExternalMessageSubjects.OTHER,
    },
  ];

export const ReduxRequestEvents = {
  REQUESTED: 'REQUESTED',
  SUCCEEDED: 'SUCCEEDED',
  IDLE: 'IDLE',
  FAILED: 'FAILED',
} as const;
