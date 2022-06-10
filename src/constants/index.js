import { GA_TAGS } from 'src/constants/tags';

import {
  ADMIN_ZONES,
  ADMIN_ZONES_FILTERS,
  DEPARTMENTS_FILTERS,
  REGIONS_FILTERS,
} from 'src/constants/departements';
import _ from 'lodash';

const OFFER_STATUS = [
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

const BUSINESS_LINES = [
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
    prefix: ['le', 'la'],
  },
  {
    label: 'Direction financière, juridique et ressources humaines',
    value: 'fjr',
    prefix: ['la', 'les'],
  },
  /*  {
    label: 'Cadre',
    value: 'cad',
    prefix: 'le ',
  }, */
].sort(({ label: labelA }, { label: labelB }) => {
  return labelA.localeCompare(labelB);
});

const CV_STATUS = {
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

const AMBITIONS_PREFIXES = [
  {
    label: 'dans',
    value: 'dans',
  },
  {
    label: 'comme',
    value: 'comme',
  },
];

const OFFER_CANDIDATE_FILTERS_DATA = [
  { tag: 'private', title: 'Offres personnelles', active: true },
  { tag: 'public', title: 'Offres générales' },
  { tag: 'archived', title: 'Offres archivées' },
];

const OFFER_ADMIN_FILTERS_DATA = [
  { tag: 'pending', title: 'Offres à valider' },
  { tag: 'validated', title: 'Offres publiées', active: true },
  { tag: 'external', title: 'Offres externes' },
  { tag: 'archived', title: 'Offres archivées' },
];

const CV_FILTERS_DATA = [
  {
    key: 'employed',
    type: 'checkbox',
    constants: [
      { label: "Recherche d'emploi", value: false },
      { label: 'En emploi', value: true },
    ],
    title: 'Masquer les candidats en emploi',
  },
  {
    key: 'locations',
    constants: REGIONS_FILTERS,
    priority: _.orderBy(
      REGIONS_FILTERS.filter((region) => {
        return region.zone !== ADMIN_ZONES.HZ;
      }),
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
];

const OPPORTUNITY_FILTERS_DATA = [
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
];

const MEMBER_FILTERS_DATA = [
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

const USER_ROLES = {
  COACH: 'Coach',
  CANDIDAT: 'Candidat',
  ADMIN: 'Admin',
};

const ADMIN_ROLES = {
  CANDIDATES: 'Candidats',
  COMPANIES: 'Entreprises',
};

const CONTRACTS = [
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
    label: 'Autre',
    value: 'other',
    end: true,
  },
];

const EXTERNAL_OFFERS_ORIGINS = [
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

const EXTERNAL_LINKS = {
  DONATION: 'https://entourage.iraiser.eu/linkedout/~mon-don',
  LKO_VG: 'https://www.linkedout-vendeeglobe.com',
  LKO_VG_CONTEST: 'https://www.linkedout-vendeeglobe.com/vendeearctique',
  LKO_BLOG: 'https://blog.linkedout.fr',
  ENTOURAGE: 'https://www.entourage.social',
  LEGAL_MENTIONS:
    'https://docs.google.com/document/d/1a1IU9Y6qVDr4pvWJRE5XMVZ2fNhg0rhXMTL_lqY_f1M/pub',
  ARTICLE_BC: 'https://blog.entourage.social/2020/06/22/benevole-coach/',
  ARTICLE_TJV:
    'https://blog.linkedout.fr/2021/11/25/le-bateau-linkedout-vainqueur-de-la-transat-jacques-vabre/',
  CAMPUS_INCLUSION: 'https://campus-inclusion.fr',
  FRANCE_UNE_CHANCE:
    'https://lafrance-unechance.fr/carte-des-clubs-la-france-une-chance/',
  REPAIRS_75: 'https://www.repairs75.org/',
  REDSTAR:
    'https://blog.linkedout.fr/2021/07/21/apres-la-voile-le-foot-linkedout-nouveau-partenaire-maillot-du-red-star-fc-avec-le-soutien-de-randstad/',
  RECRUITMENTS: 'https://www.welcometothejungle.com/fr/companies/entourage',
};

const NEWSLETTER_TAGS = {
  ZONE: [
    {
      label: 'Région parisienne',
      tag: ADMIN_ZONES.PARIS,
    },
    {
      label: 'Lyon',
      tag: ADMIN_ZONES.LYON,
    },
    {
      label: 'Lille',
      tag: ADMIN_ZONES.LILLE,
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
      tag: 'STRUCTURE_INSERTION',
    },
    {
      label: 'un candidat potentiel',
      tag: 'CANDIDAT_POTENTIEL',
    },
  ],
};

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access-token',
};

const SOCKETS = {
  CHANNEL_NAMES: {
    CV_PREVIEW: 'cv-preview-channel',
    CV_PDF: 'cv-pdf-channel',
  },
  EVENTS: {
    CV_PREVIEW_DONE: 'cv-preview-done',
    CV_PDF_DONE: 'cv-pdf-done',
  },
};

const VALUES = { SHARES: 120000 + 64000 };

const CONTACT_INFO = {
  CORPORATE_CONTACT: 'barnabe@entourage.social',
  MAIN_PHONE_NUMBER: '01 88 24 70 70',
  MOBILE_PHONE_NUMBER: '07 82 44 97 39',
};

const INITIAL_NB_OF_CV_TO_DISPLAY = 9;

const HEARD_ABOUT = [
  {
    label: 'Par un de mes contacts',
    value: 'contact',
  },
  {
    label: 'Recherche internet',
    value: 'search',
  },
  {
    label: 'Publicité sur les réseaux sociaux',
    value: 'socialAdd',
  },
  {
    label: 'Autre publicité',
    value: 'otherAdd',
  },
  {
    label: 'Press',
    value: 'press',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

export {
  OFFER_STATUS,
  CV_STATUS,
  USER_ROLES,
  BUSINESS_LINES,
  EXTERNAL_LINKS,
  VALUES,
  CV_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  OFFER_CANDIDATE_FILTERS_DATA,
  OFFER_ADMIN_FILTERS_DATA,
  MEMBER_FILTERS_DATA,
  NEWSLETTER_TAGS,
  CONTACT_INFO,
  INITIAL_NB_OF_CV_TO_DISPLAY,
  SOCKETS,
  STORAGE_KEYS,
  ADMIN_ROLES,
  CONTRACTS,
  HEARD_ABOUT,
  AMBITIONS_PREFIXES,
  EXTERNAL_OFFERS_ORIGINS,
};
