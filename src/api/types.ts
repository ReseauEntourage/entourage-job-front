import {
  AmbitionsPrefixesType,
  BusinessLineValue,
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

export type UserProfile = {
  currentJob: string | null;
  description: string | null;
  department: Department;
  isAvailable: boolean;
  unavailabilityReason: string | null;
  helpNeeds: { name: HelpValue }[] | null;
  helpOffers: { name: HelpValue }[] | null;
  networkBusinessLines:
    | {
        name: BusinessLineValue;
        order: number;
      }[]
    | null;
  searchBusinessLines:
    | {
        name: BusinessLineValue;
        order: number;
      }[]
    | null;
  searchAmbitions:
    | { name: string; order: number; prefix: AmbitionsPrefixesType }[]
    | null;
  lastSendMessage: string | null;
  lastReceivedMessage: string | null;
  linkedinUrl: string | null;
  hasExternalCv: boolean;
  hasAcceptedEthicsCharter: boolean;
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
  searchAmbitions?: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  searchBusinessLines?: {
    name: BusinessLineValue;
    order: number;
  }[];
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
  searchAmbitions?: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  searchBusinessLines?: {
    name: BusinessLineValue;
    order: number;
  }[];
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

export type Media = {
  id: string;
  name: string;
  s3Key: string;
  mimeType: string;
  size: number;
  userId: string;
  signedUrl: string;
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
  medias: Media[];
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
  conversationParticipant: {
    id: string;
    seenAt: string;
    createdAt: string;
    updatedAt: string;
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
  shouldGiveFeedback?: boolean;
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
  cvUrl?: string;
  hasExternalCv: boolean;
};

export type ProfilesFilters = {
  role: UserRole[];
  search?: string;
  helps: HelpValue | HelpValue[];
  departments: Department | Department[];
  businessLines: BusinessLineValue | BusinessLineValue[];
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
