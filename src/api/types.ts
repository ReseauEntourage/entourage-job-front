import {
  OccupationsPrefixesType,
  CandidateHelpWithValue,
  CompanyApproach,
  Contract as ContractValue,
  DocumentNameType,
  ExternalMessageContactType,
  HeardAboutValue,
} from 'src/constants';
import { AdminZone, Department } from 'src/constants/departements';
import { HelpValue } from 'src/constants/helps';
import { Program } from 'src/constants/programs';
import {
  AdminRole,
  Gender,
  RegistrableUserRole,
  UserRole,
} from 'src/constants/users';

export type SocialMedia =
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'whatsapp'
  | 'other';

export const APIRoutes = {
  USERS: 'user',
  AUTH: 'auth',
  CONTACTS: 'contact',
  CVS: 'cv',
  ORGANIZATIONS: 'organization',
  MESSAGE: 'message',
  READ_DOCUMENTS: 'readDocuments',
  EXTERNAL_CVS: 'external-cv',
  MESSAGING: 'messaging',
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
  id: string;
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
  referersCount: number;
};

export type OrganizationDto = {
  id?: string;
  name: string;
  address?: string;
  referentFirstName: string;
  referentLastName: string;
  referentMail: string;
  referentPhone: string;
  zone: AdminZone;
};

export interface BusinessSector {
  id?: string;
  name: string;
  order: number;
}

export type Occupation = {
  id?: string;
  name: string;
  order: number;
  prefix: OccupationsPrefixesType;
};

export interface Review {
  id?: string;
  name: string;
  text: string;
  status: string;
}

export interface Experience {
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

export interface Formation {
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

export type Skill = {
  id: string;
  name: string;
  order: number;
};

export type Language = {
  id: string;
  name: string;
  value: string;
  userProfileLanguages: {
    level: string;
  };
};

export type UserProfile = {
  currentJob: string | null;
  description: string | null;
  department: Department;
  isAvailable: boolean;
  unavailabilityReason: string | null;
  helpNeeds: { name: HelpValue }[] | null;
  helpOffers: { name: HelpValue }[] | null;
  businessSectors: BusinessSector[] | null;
  occupations: Occupation[] | null;
  lastSendMessage: string | null;
  lastReceivedMessage: string | null;
  linkedinUrl: string | null;
  hasExternalCv: boolean;
  hasAcceptedEthicsCharter: boolean;
  reviews: Review[] | null;
  experiences: Experience[] | null;
  formations: Formation[] | null;
  skills: Skill[] | null;
  languages: Language[];
};

export type UserReportDto = {
  reason: string;
  comment: string;
};

export type ConversationReportDto = {
  reason: string;
  comment: string;
};

export type UserSocialSituation = {
  hasCompletedSurvey: boolean;
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
  whatsappZoneCoachQR: string;
  whatsappZoneCoachName: string;
  whatsappZoneCoachUrl: string;
  organization: Organization;
  deletedAt?: string;
  userProfile: UserProfile;
  userSocialSituation: UserSocialSituation;
  OrganizationId?: string;
  readDocuments: { documentName: DocumentNameType }[];
  isEmailVerified: boolean;
};

export type CVStatus =
  | 'Draft'
  | 'Published'
  | 'New'
  | 'Pending'
  | 'Progress'
  | 'Unknown';

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
      id: string;
    };
    employed: boolean;
    url: string;
    hidden: boolean;
    endOfContract?: string;
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
  occupations: Occupation[];
  businessSectors: BusinessSector[];
  languages: {
    name: string;
  }[];
  transport: string;
  skills: Skill[];
  passions: {
    id?: string;
    name: string;
    order: number;
  }[];
  reviews: Review[];
  formations?: Formation[];
  experiences?: Experience[];
  status: CVStatus;
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
  referredCandidates?: UserCandidateWithUsers[];
}

export type UserDto = {
  firstName: string;
  lastName: string;
  role: UserRole;
  gender: Gender;
  zone: AdminZone;
  phone: string;
  userToLinkId?: string;
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

export type UserRegistrationDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: RegistrableUserRole;
  campaign?: string;
  department: Department;
  helpNeeds?: { name: HelpValue }[];
  workingRight?: string;
  program?: Program;
  organizationId?: string;
  birthDate: string;
  occupations?: Occupation[];
  businessSectorIds?: string[];
  materialInsecurity?: string;
  networkInsecurity?: string;
};

export type UserReferingDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  campaign?: string;
  department: Department;
  helpNeeds?: { name: HelpValue }[];
  workingRight?: string;
  program?: Program;
  birthDate: string;
  occupations?: Occupation[];
  businessSectorIds?: string[];
};

export type Contract = {
  id: string;
  name: ContractValue;
  createdAt: string;
  updatedAt: string;
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
  businessSectors?: string[];
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

export type Message = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  author: User;
};

export type ConversationParticipant = Pick<
  User,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'role'
  | 'userProfile'
  | 'gender'
  | 'zone'
  | 'email'
> & {
  ConversationParticipant: {
    id: string;
    seenAt: string;
  };
};
export type ConversationParticipants = ConversationParticipant[];

export type Conversation = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  messages: Message[];
  participants: ConversationParticipants;
  seenAt?: string;
};

export type MessageWithConversation = Message & {
  conversation: Conversation;
};

export type PublicProfile = {
  id: string;
  firstName: string;
  lastName: string;
  linkedinUrl?: string;
  role: UserRole;
  department: Department;
  currentJob: string;
  description: string;
  isAvailable: boolean;
  helpNeeds: { name: HelpValue }[];
  helpOffers: { name: HelpValue }[];
  businessSectors: BusinessSector[];
  occupations: Occupation[];
  lastSentMessage: string;
  lastReceivedMessage: string;
  cvUrl?: string;
  hasExternalCv: boolean;
};

export type PrivateProfile = PublicProfile & {
  email: string;
  phone: string;
};

export type Profile = PublicProfile | PrivateProfile;

export type ProfilesFilters = {
  role: UserRole[];
  search?: string;
  helps: HelpValue | HelpValue[];
  departments: Department | Department[];
  businessSectorIds: string | string[];
};

export type PostAuthSendVerifyEmailParams = {
  token?: string;
  email?: string;
};

export type PostAuthFinalizeReferedUserParams = {
  token: string;
  password: string;
};

export type ExternalCv = {
  url: string;
};
