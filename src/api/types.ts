import {
  AmbitionsPrefixesType,
  BusinessLineValue,
  CandidateHelpWithValue,
  CompanyApproach,
  Contract as ContractValue,
  ExternalMessageContactType,
  ExternalOfferOrigin,
  HeardAboutValue,
  OfferStatus,
} from 'src/constants';
import { AdminZone, Department } from 'src/constants/departements';
import { HelpNames } from 'src/constants/helps';
import { AdminRole, Gender, UserRole } from 'src/constants/users';

export type SocialMedia =
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'whatsapp'
  | 'other';

export const APIRoutes = {
  USERS: 'user',
  AUTH: 'auth',
  OPPORTUNITIES: 'opportunity',
  CONTACTS: 'contact',
  CVS: 'cv',
  ORGANIZATIONS: 'organization',
  MESSAGE: 'message',
} as const;

export type APIRoute = (typeof APIRoutes)[keyof typeof APIRoutes];

export type Route<T extends APIRoute> = `/${T}/${string}` | `/${T}`;

export type UserCandidate = {
  employed: boolean;
  contract: ContractValue | null;
  endOfContract: string | null;
  hidden: boolean;
  note: string;
  url: string;
  lastModifiedBy: string;
  deletedAt: string;
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

export type UserProfile = {
  currentJob: string;
  description: string;
  department: Department;
  isAvailable: boolean;
  helpNeeds: { name: HelpNames }[];
  helpOffers: { name: HelpNames }[];
  networkBusinessLines: {
    name: BusinessLineValue;
    order: number;
  }[];
  searchBusinessLines: {
    name: BusinessLineValue;
    order: number;
  }[];
  searchAmbitions: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  lastSendMessage: string;
  lastReceivedMessage: string;
};
export type User = {
  coach: User;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  adminRole: AdminRole;
  password: string;
  salt: string;
  gender: Gender;
  phone: string;
  address: string;
  lastConnection: Date;
  hashReset: string;
  saltReset: string;
  zone: AdminZone;
  organization: Organization;
  deletedAt?: string;
  userProfile: UserProfile;
  OrganizationId?: string;
};

export interface CVExperience {
  id?: string;

  description?: string;
  title: string;
  dateStart?: Date;
  dateEnd?: Date;
  company?: string;
  location?: string;
  order?: number;
  skills: {
    id?: string;
    name: string;
    order: number;
  }[];
}

export interface CVFormation {
  id?: string;
  description?: string;
  title: string;
  dateStart?: Date;
  dateEnd?: Date;
  institution?: string;
  location?: string;
  skills: {
    id?: string;
    name: string;
    order: number;
  }[];
}

export interface CV {
  id?: string;
  version: string;
  profileImage: Blob;
  user: {
    candidat: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      zone: AdminZone;
      gender: Gender;
    };
  };
  catchphrase: string;
  story: string;
  locations: {
    name: Department;
    order: number;
  }[];
  availability: string;
  urlImg: string;
  contracts: {
    name: ContractValue;
  }[];
  ambitions: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  businessLines: {
    name: BusinessLineValue;
    order: number;
  }[];
  languages: {
    name: string;
  }[];
  transport: string;
  skills: {
    id?: string;
    name: string;
    order: number;
  }[];
  passions: {
    id?: string;
    name: string;
    order: number;
  }[];
  reviews: {
    id?: string;
    name: string;
    text: string;
    status: string;
  }[];
  formations?: CVFormation[];
  experiences?: CVExperience[];
  status: string;
  UserId: string;
}

export interface UserCandidateWithUsers extends UserCandidate {
  id?: string;
  email?: string;
  candidat: User;
  coach?: User;
  cvs?: CV[];
  firstName?: string;
  lastName?: string;
}

export interface UserWithUserCandidate extends User {
  candidat?: UserCandidateWithUsers;
  coaches?: UserCandidateWithUsers[];
}

export type UserDto = {
  firstName: string;
  lastName: string;
  role: UserRole;
  gender: Gender;
  zone: AdminZone;
  phone: string;
  userToLinkId?: string | string[];
  email: string;
  adminRole?: AdminRole;
  OrganizationId?: string;
  id?: string;
  userProfile?: UserProfile;
};

export type PutCandidate = {
  employed: boolean;
  contract: ContractValue | null;
  endOfContract: string | null;
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
  externalOrigin: ExternalOfferOrigin;
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
  department: Department;
  contract: ContractValue;
  startOfContract: string;
  endOfContract: string;
  isPartTime: boolean;
  numberOfPositions: number;
  message: string;
  driversLicense: boolean;
  workingHours: string;
  salary: string;
  otherInfo: string;
  businessLines: { name: BusinessLineValue; order: number }[];
  candidatesIds: string[];
  isAdmin: boolean;
  shouldSendNotifications: boolean;
  isCopy: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
};

export type OpportunityType = 'public' | 'private';

export type OpportunityTabCount = {
  status: -1 | 0 | 1 | 2 | 3 | 4 | 'archived';
  count: number;
};

export type OpportunityDto = {
  title: string;
  isPublic: boolean;
  isValidated?: boolean;
  isArchived?: boolean;
  company: string;
  recruiterName: string;
  recruiterFirstName: string;
  recruiterMail: string;
  contactMail?: string;
  recruiterPosition: string;
  recruiterPhone: string;
  date: string;
  description: string;
  companyDescription: string;
  department?: Department;
  address?: string;
  contract: ContractValue;
  startOfContract?: string;
  endOfContract?: string;
  isPartTime: boolean;
  message: string;
  driversLicense: boolean;
  workingHours: string;
  salary: string;
  otherInfo: string;
  businessLines?: { name: BusinessLineValue; order: number }[];
  candidatesIds: string[];
  isAdmin?: boolean;
  shouldSendNotifications?: boolean;
  isCopy?: boolean;
  locations?: { department: Department; address: string }[];
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
  note: string;
  recommended: boolean;
  seen: boolean;
  status: OfferStatus;
  updatedAt: string;
  user: UserCandidateWithUsers;
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

export interface AdminOpportunityWithOpportunityUsers extends Opportunity {
  opportunityUsers: OpportunityUser[];
}

export type ExternalOpportunityDto = {
  title: string;
  company: string;
  contract: ContractValue;
  startOfContract?: string;
  endOfContract?: string;
  isPartTime?: boolean;
  businessLines?: { name: BusinessLineValue; order: number }[];
  department: Department;
  link: string;
  description: string;
  externalOrigin?: ExternalOfferOrigin;
  date: string;
  candidateId: string;
  status?: number;
};

export type OpportunityUserEvent = {
  startDate: string;
  endDate?: string;
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
  heardAbout: HeardAboutValue;
  cgu: boolean;
};

export type ContactCompany = {
  firstName: string;
  lastName: string;
  approach: CompanyApproach;
  email: string;
  company: string;
  position: string;
  zone: AdminZone;
  phone?: string;
  heardAbout?: HeardAboutValue;
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
  helpWith: CandidateHelpWithValue[];
  gender: Gender;
  birthDate?: string;
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
  businessLines?: BusinessLineValue[];
  description: string;
  heardAbout: string;
  diagnostic?: string;
  contactWithCoach?: boolean;
};

export type ContactNewsletter = {
  email: string;
  zone?: string;
  status?: string;
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
  tsPrescripteur?: string;
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

export type InternalMessage = {
  addresseeUserId: string;
  subject: string;
  message: string;
  // answered by the DB
  senderUserId?: string;
  createdAt?: string;
  id?: string;
};

export type PublicProfile = {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: Department;
  currentJob: string;
  description: string;
  isAvailable: boolean;
  helpNeeds: { name: HelpNames }[];
  helpOffers: { name: HelpNames }[];
  networkBusinessLines: {
    name: BusinessLineValue;
    order: number;
  }[];
  searchBusinessLines: {
    name: BusinessLineValue;
    order: number;
  }[];
  searchAmbitions: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  lastSentMessage: string;
  lastReceivedMessage: string;
};

export type ProfilesFilters = {
  role: UserRole[];
  search?: string;
  helps: HelpNames | HelpNames[];
  departments: Department | Department[];
  businessLines: BusinessLineValue | BusinessLineValue[];
};

export type OpportunitiesFiltersForCandidate = {
  search?: string;
  status?: OfferStatus;
  type?: OpportunityType;
  department: Department | Department[];
  businessLines: BusinessLineValue | BusinessLineValue[];
};
