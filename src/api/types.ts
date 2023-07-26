import { CookieValueTypes } from 'cookies-next';

import {
  ExternalMessageContactType,
  Contract as ContractValue,
  AmbitionsPrefixesType,
} from 'src/constants';
import { AdminZone } from 'src/constants/departements';
import { AdminRole, UserRole } from 'src/constants/users';

export type SocialMedia = 'facebook' | 'linkedin' | 'twitter';

export const APIRoutes = {
  USERS: 'user',
  AUTH: 'auth',
  OPPORTUNITIES: 'opportunity',
  CONTACTS: 'contact',
  CVS: 'cv',
  ORGANIZATIONS: 'organization',
  EXTERNAL_MESSAGES: 'externalMessage',
} as const;

export type APIRoute = (typeof APIRoutes)[keyof typeof APIRoutes];

export type Route<T extends APIRoute> = `/${T}/${string}` | `/${T}`;

export type UserCandidate = {
  employed: boolean;
  contract: ContractValue;
  endOfContract: string;
  hidden: boolean;
  note: string;
  url: string;
  lastModifiedBy: string;
};

export type Organization = {
  id?: string;
  name: string;
  address?: string;
  organizationReferent: {
    referentFirstName: string;
    referentLastName: string;
    referentMail: string;
    referentPhone: string;
  };
  zone: AdminZone;
  candidatesCount: number;
  coachesCount: number;
};

export type OrganizationDto = {
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
  coach: User;
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
  deletedAt?: string;
};

export interface CV {
  id?: string;
  version: string;
  profileImage: string;
  profileImageObjectUrl: string;
  user: {
    candidat: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      zone: string;
      gender: number;
    };
  };
  catchphrase: string;
  story: string;
  locations: {
    name: string;
    order: number;
  }[];
  availability: string;
  urlImg: string;
  contracts: {
    name: string;
  }[];
  ambitions: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  businessLines: {
    name: string;
    order: number;
  }[];
  languages: {
    name: string;
    order: number;
  }[];
  transport: string;
  skills: {
    id: string;
    name: string;
    order: number;
  }[];
  passions: {
    name: string;
    order: number;
  }[];
  reviews: {
    id: string;
    name: string;
    text: string;
    status: string;
  }[];
  experiences: {
    description: string;
    order: number;
    skills: {
      id: string;
      name: string;
      order: number;
    }[];
  }[];
  status: string;
  UserId: string;
}

export interface UserCandidateWithUsers extends UserCandidate {
  email: string;
  candidat?: User;
  coach?: User;
  cvs?: CV[];
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
  id?: string;
};

export type PutCandidate = {
  employed: boolean;
  contract: ContractValue;
  endOfContract: Date;
  hidden: boolean;
  note: string;
  url: string;
  lastModifiedBy: string;
};

export type Opportunity = {
  id?: string;
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
  date: string;
  address: string;
  description: string;
  companyDescription: string;
  skills: string;
  prerequisites: string;
  department: string;
  contract: ContractValue;
  startOfContract: string;
  endOfContract: string;
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
  createdAt: string;
};

export type Skill = {
  id: string;
  name: string;
  CVs: CV[];
  createdAt: string;
  updatedAt: string;
};

export type Contract = {
  id: string;
  name: ContractValue;
  createdAt: string;
  updatedAt: string;
};

export type Event = {
  id: string;
  OpportunityUserId: string;
  ContractId: string;
  type: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  contract: Contract;
};
export interface OpportunityUser {
  OpportunityId: string;
  UserId: string;
  archived: boolean;
  bookmarked: boolean;
  createdAt: string;
  events: Event[];
  id: string;
  note: [];
  recommended: boolean;
  seen: boolean;
  status: number;
  updatedAt: string;
  user: UserCandidateWithUsers | UserCandidateWithUsers[];
  otherInfo: string;
  prerequisites: string;
  recruiterFirstName: string;
  recruiterMail: string;
  recruiterName: string;
  recruiterPosition: string;
  salary: string;
  skills: Skill[];
}
export interface OpportunityWithOpportunityUsers extends Opportunity {
  opportunityUsers: OpportunityUser;
}

export type ExternalOpportunity = {
  title: string;
  company: string;
  contract: ContractValue;
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
  endDate?: Date;
  type: string;
  contract: { name: ContractValue };
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

export type ExternalMessage = {
  UserId: string;

  senderFirstName: string;

  senderLastName: string;

  senderEmail: string;

  senderPhone: string;

  subject: string;

  message: string;

  type: ExternalMessageContactType;
};
