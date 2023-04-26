import { CookieValueTypes } from 'cookies-next';

import { AdminZone } from 'src/constants/departements';
import { AdminRole, UserRole } from 'src/constants/users';

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

export type UserCandidate = {
  employed: boolean;
  contract: string;
  endOfContract: string;
  hidden: boolean;
  note: string;
  url: string;
  lastModifiedBy: string;
};

export type Organization = {
  id?: string;
  name: string;
  address: string;
  referentFirstName: string;
  referentLastName: string;
  referentMail: string;
  referentPhone: string;
  zone: AdminZone;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  adminRole: string;
  password: string;
  salt: string;
  gender: number;
  phone: string;
  address: string;
  lastConnection: Date;
  hashReset: string;
  saltReset: string;
  zone: AdminZone;
  userToCoach: string;
  organization: Organization;
};

export interface UserCandidateWithUsers extends UserCandidate {
  candidat?: User;
  coach?: User;
}

export interface UserWithUserCandidate extends User {
  candidat?: UserCandidateWithUsers;
  coaches?: UserCandidateWithUsers[];
}

export type UserDto = {
  firstName: string;
  lastName: string;
  role: UserRole;
  gender: 0 | 1;
  zone: AdminZone;
  phone: string;
  userToLinkId: string | string[];
  email: string;
  adminRole?: AdminRole;
  OrganizationId?: string;
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

type CVEntity = {
  name: string;
  order?: number;
};

export type CV = {
  id: string;
  UserId: string;
  urlImg: string;
  intro: string;
  story: string;
  availability: string;
  transport: string;
  catchphrase: string;
  status: string;
  version: number;
  lastModifiedBy: string;
  user: User;
  businessLines: CVEntity[];
  locations: CVEntity[];
  ambitions: CVEntity[];
  contracts: CVEntity[];
  languages: CVEntity[];
  passions: CVEntity[];
  skills: CVEntity[];
  experiences: {
    id: string;
    description: string;
    order: string;
    skills: CVEntity[];
  }[];

  reviews: CVEntity[];
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
