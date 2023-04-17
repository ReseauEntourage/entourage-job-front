import { CookieValueTypes } from 'cookies-next';

import { USER_ROLES } from 'src/constants';
import { ADMIN_ZONES } from 'src/constants/departements';

export type SocialMedia = 'facebook' | 'linkedin' | 'twitter';

export const APIRoutes = {
  USERS: 'user',
  AUTH: 'auth',
  OPPORTUNITIES: 'opportunity',
  CONTACTS: 'contact',
  CVS: 'cv',
  ORGANIZATION: 'organization',
} as const;

export type APIRoute = (typeof APIRoutes)[keyof typeof APIRoutes];

export type Route<T extends APIRoute> = `/${T}/${string}` | `/${T}`;

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  adminRole: string;
  password: string;
  salt: string;
  gender: number;
  phone: string;
  address: string;
  lastConnection: Date;
  hashReset: string;
  saltReset: string;
  zone: string;
  userToCoach: string;
};

export type CreateUserDto = {
  firstName: string;
  lastName: string;
  role: typeof USER_ROLES;
  gender: 0 | 1;
  zone: typeof ADMIN_ZONES;
  phone: string;
  userToLinkId: string | string[];
  email: string;
  OrganizationId?: string;
};

export type Organization = {
  name: string;
  address: string;
  referentFirstName: string;
  referentLastName: string;
  referentMail: string;
  referentPhone: string;
  zone: string;
};

export type Opportunity = {
  title: string;
  isPublic: boolean;
  isValidated: boolean;
  isArchived: boolean;
  isExternal: boolean;
  link: string;
  externalOrigin: string;
  company: string;
  recruiterName: string;
  recruiterFirstName: string;
  recruiterMail: string;
  contactMail: string;
  recruiterPosition: string;
  recruiterPhone: string;
  date: Date;
  address: string;
  description: string;
  companyDescription: string;
  skills: string;
  prerequisites: string;
  department: string;
  contract: string;
  startOfContract: Date;
  endOfContract: Date;
  isPartTime: boolean;
  numberOfPositions: number;
  beContacted: boolean;
  message: string;
  driversLicense: boolean;
  workingHours: string;
  salary: string;
  otherInfo: string;
  businessLines: { name: string; order: string }[];
  candidatesIds: string[];
  isAdmin: boolean;
  shouldSendNotifications: boolean;
  isCopy: boolean;
  locations: object;
  visit: string;
  visitor: string;
  urlParams: object;
};

export type ExternalOpportunity = {
  title: string;
  company: string;
  contract: string;
  startOfContract: string;
  endOfContract: string;
  isPartTime: string;
  businessLines: { name: string; order: string }[];
  department: string;
  link: string;
  description: string;
  externalOrigin: string;
  date: string;
  candidateId: string;
  status: string;
};

export type OpportunityUserEvent = {
  startDate: Date;
  endDate: Date;
  type: string;
  contract: { name: string };
};

export type OpportunityJoin = {
  status: number;
  seen: boolean;
  bookmarked: boolean;
  archived: boolean;
  recommended: boolean;
  note: string;
  OpportunityId: string;
  UserId: string;
};

export type ContactContactUs = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  structure: string;
  message: string;
  heardAbout: object;
  cgu: boolean;
};

export type ContactCompany = {
  firstName: string;
  lastName: string;
  approach: object;
  email: string;
  company: string;
  position: string;
  zone: object;
  phone?: string;
  heardAbout?: object;
};

export type ContactCandidate = {
  workerFirstName: string;
  workerLastName: string;
  structure: string;
  workerPosition?: string;
  workerEmail: string;
  workerPhone: string;
  firstName: string;
  lastName: string;
  helpWith: string[];
  gender: string;
  birthDate?: Date;
  address?: string;
  postalCode: string;
  city: string;
  phone: string;
  email?: string;
  registeredUnemploymentOffice: string;
  administrativeSituation?: string;
  workingRight: string;
  accommodation: string;
  professionalSituation: string;
  resources?: string;
  domiciliation: string;
  socialSecurity: string;
  handicapped?: string;
  bankAccount: string;
  businessLines?: string[];
  description: string;
  heardAbout: string;
  diagnostic?: string;
  contactWithCoach?: boolean;
};

export type ContactNewsletter = {
  email: string;
  zone?: string;
  status?: string;
  visit?: CookieValueTypes;
  visitor?: string;
  urlParams?: {
    utm?: string | string[];
    utm_medium?: string | string[];
    utm_source?: string | string[];
    gclid?: string | string[];
    referer?: string | string[];
  };
};

export type PutCandidate = {
  employed: boolean;
  contract: string;
  endOfContract: Date;
  hidden: boolean;
  note: string;
  url: string;
  lastModifiedBy: string;
};

export type CandidateInscription = {
  birthdate: string;
  email: string;
  firstName: string;
  heardAbout: string;
  infoCo?: string;
  lastName: string;
  location: string;
  phone: string;
  workingRight: string;
};
