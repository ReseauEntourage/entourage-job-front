import _ from 'lodash';
import {
  ADMIN_ZONES,
  ADMIN_ZONES_FILTERS,
  DEPARTMENTS_FILTERS,
  REGIONS_FILTERS,
} from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';
import { GENDERS_FILTERS } from './genders';
import { ProfileHelps } from './helps';
import { Filter, FilterConstant } from './utils';

export const PROFILES_LIMIT = 25;

export const JNSPR = {
  value: 'jnspr',
  label: 'Je ne souhaite pas répondre',
};

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
    /**
     * force type because business lines are always string
     * to fix: fix FilterConstant type
     */
    const first = labelA as string;
    const second = labelB as string;
    return first.localeCompare(second);
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
} as const;

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

export const OPPORTUNITY_FILTERS_DATA: Filter[] = [
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
];

export const DirectoryFilters: Filter[] = [
  {
    key: 'departments',
    constants: DEPARTMENTS_FILTERS,
    title: 'Département',
    tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_DEPARTEMENT_CLIC,
  },
  {
    key: 'helps',
    constants: ProfileHelps,
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
  PARIS: process.env.NEXT_PUBLIC_ADRESSE_LOCAUX_PARIS,
  LYON: process.env.NEXT_PUBLIC_ADRESSE_LOCAUX_LYON,
  LILLE: process.env.NEXT_PUBLIC_ADRESSE_LOCAUX_LILLE,
  RENNES: process.env.NEXT_PUBLIC_ADRESSE_LOCAUX_RENNES,
  LORIENT: process.env.NEXT_PUBLIC_ADRESSE_LOCAUX_LORIENT,
};

export const ANTENNE_INFO = [
  {
    dpt: '93',
    mailCoordo: process.env.NEXT_PUBLIC_ADMIN_CANDIDATES_PARIS,
    mailEntreprise: process.env.NEXT_PUBLIC_ADMIN_COMPANIES_PARIS,
    city: 'Paris',
    address: ADDRESSES.PARIS,
  },
  {
    dpt: '75',
    mailCoordo: process.env.NEXT_PUBLIC_ADMIN_CANDIDATES_PARIS,
    mailEntreprise: process.env.NEXT_PUBLIC_ADMIN_COMPANIES_PARIS,
    city: 'Paris',
    address: ADDRESSES.PARIS,
  },
  {
    dpt: '92',
    mailCoordo: process.env.NEXT_PUBLIC_ADMIN_CANDIDATES_PARIS,
    mailEntreprise: process.env.NEXT_PUBLIC_ADMIN_COMPANIES_PARIS,
    city: 'Paris',
    address: ADDRESSES.PARIS,
  },
  {
    dpt: '35',
    mailCoordo: process.env.NEXT_PUBLIC_ADMIN_CANDIDATES_RENNES,
    mailEntreprise: process.env.NEXT_PUBLIC_ADMIN_COMPANIES_RENNES,
    city: 'Rennes',
    address: ADDRESSES.RENNES,
  },
  {
    dpt: '59',
    mailCoordo: process.env.NEXT_PUBLIC_ADMIN_CANDIDATES_LILLE,
    mailEntreprise: process.env.NEXT_PUBLIC_ADMIN_COMPANIES_LILLE,
    city: 'Lille',
    address: ADDRESSES.LILLE,
  },
  {
    dpt: '69',
    mailCoordo: process.env.NEXT_PUBLIC_ADMIN_CANDIDATES_LYON,
    mailEntreprise: process.env.NEXT_PUBLIC_ADMIN_COMPANIES_LYON,
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
      label: 'Coach/connecteur Entourage Pro',
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

export const InternalMessageSubject = {
  HELP_INTERVIEW: 'help_interview',
  HELP_CV: 'help_cv',
  NETWORKING: 'networking',
  ADVICE: 'advice',
  MEET: 'meet',
  OTHER: 'other',
} as const;

export type InternalMessageSubject =
  (typeof InternalMessageSubject)[keyof typeof InternalMessageSubject];

export const INTERNAL_MESSAGE_SUBJECT_FILTER: FilterConstant<InternalMessageSubject>[] =
  [
    {
      label: 'Aide à la préparation d’entretien',
      value: InternalMessageSubject.HELP_INTERVIEW,
    },
    {
      label: 'Aide pour réaliser le CV',
      value: InternalMessageSubject.HELP_CV,
    },
    {
      label: 'Partage de réseau / Mise en lien',
      value: InternalMessageSubject.NETWORKING,
    },
    {
      label: 'Conseils',
      value: InternalMessageSubject.ADVICE,
    },
    {
      label: 'Se rencontrer et échanger',
      value: InternalMessageSubject.MEET,
    },
    {
      label: 'Prise de contact',
      value: InternalMessageSubject.OTHER,
    },
  ];

export const INTERNAL_MESSAGES_PLACEHOLDERS = {
  CANDIDATE: {
    [InternalMessageSubject.HELP_INTERVIEW]:
      'Bonjour X, j’ai cru comprendre que vous recherchiez de l’aide à la préparation d’entretien. Je peux vous apporter ce coup de pouce, quelles sont vos disponibilités ?',
    [InternalMessageSubject.HELP_CV]:
      'Bonjour X, j’ai cru comprendre que vous recherchiez de l’aide pour réaliser votre CV. Je peux vous apporter ce coup de pouce, quelles sont vos disponibilités ?',
    [InternalMessageSubject.NETWORKING]:
      'Bonjour X, j’ai cru comprendre que vous aimeriez des mises en relation. Il est possible que je puisse vous apporter un coup de pouce. Pouvez-vous me spécifier votre besoin ? ',
    [InternalMessageSubject.ADVICE]:
      'Bonjour X, j’ai cru comprendre que vous recherchiez du conseils. Il est possible que je puisse vous apporter un coup de pouce. Quels types de conseil recherchez-vous ? ',
    [InternalMessageSubject.MEET]:
      'Bonjour X, j’ai cru comprendre que vous recherchiez à échanger avec des professionnels. Je serai ravi.e de vous rencontrer. Quelles seraient vos disponibilités ?',
    [InternalMessageSubject.OTHER]:
      'Bonjour X, j’ai cru comprendre que vous aviez besoin d’un coup de pouce. Il est possible que je puisse vous apporter mon soutien. Peut-être pourrions-nous en discuter de vive voix pour mieux comprendre votre besoin ?',
  },
  COACH: {
    [InternalMessageSubject.HELP_INTERVIEW]:
      'Bonjour Y, je cherche un coup de main pour préparer un entretien. Pouvez-vous m’apporter votre expertise ? D’avance, je vous remercie',
    [InternalMessageSubject.HELP_CV]:
      'Bonjour Y, je recherche de l’aide pour réaliser mon CV. Pouvez-vous m’apporter votre expertise ? D’avance, je vous remercie',
    [InternalMessageSubject.NETWORKING]:
      'Bonjour Y, je recherche un professionnel qui pourrait me mettre en relation avec son réseau. Pourrions-nous en discuter de vive-voix afin que je vous précise ma demande ? D’avance, je vous remercie',
    [InternalMessageSubject.ADVICE]:
      'Bonjour Y, je recherche des conseils dans ma recherche d’emploi / d’alternance. Pourrions-nous en discuter de vive voix afin que je vous précise ma demande ? D’avance, je vous remercie',
    [InternalMessageSubject.MEET]:
      'Bonjour Y, je souhaiterais échanger avec un professionnel du secteur … Seriez-vous d’accord pour que l’on se rencontre ? D’avance, je vous remercie',
    [InternalMessageSubject.OTHER]:
      'Bonjour Y, j’ai besoin d’un coup de pouce dans ma recherche d’emploi / d’alternance. Pourrions-nous en discuter de vive-voix afin que je vous précise ma demande ? D’avance, je vous remercie ',
  },
};

export const DELAY_REFRESH_CONVERSATIONS = 30000;
