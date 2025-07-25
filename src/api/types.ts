import { HelpValue } from '@/src/constants/nudges';
import { CompanyUserRole } from '../constants/company';
import { ContactTypeEnum } from '../constants/contactTypes';
import { Genders } from '../constants/genders';
import {
  CompanyApproach,
  Contract as ContractValue,
  DocumentNameType,
  ExternalMessageContactType,
  HeardAboutValue,
} from 'src/constants';
import { AdminZone, Department } from 'src/constants/departements';
import {
  AdminRoles,
  RegistrableUserRoles,
  UserRoles,
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
  COMPANIES: 'companies',
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

export type CompanyDto = {
  id?: string;
  name: string;
};

export type InviteCollaboratorsFromCompanyDto = {
  emails: string[];
};

export interface BusinessSector {
  id?: string;
  name: string;
  prefixes: string;
}

export type Occupation = {
  id?: string;
  name: string;
};

export interface Review {
  id?: string;
  content: string;
  authorLabel: string;
  authorName: string;
}

export type UserProfileSkill = {
  order: number;
};

export type Skill = {
  id?: string;
  name: string;
  userProfileSkill?: UserProfileSkill;
};

export interface Experience {
  id?: string;
  description?: string;
  title: string;
  startDate?: string;
  endDate?: string;
  company?: string;
  location?: string;
  order?: number;
  skills: Skill[];
}

export interface Formation {
  id?: string;
  description?: string;
  title: string;
  startDate?: string;
  endDate?: string;
  institution?: string;
  location?: string;
  skills: Skill[];
}

export type Language = {
  id: string;
  name: string;
  value: string;
};

export type UserProfileLanguage = {
  id?: string;
  level?: string;
  languageId: string;
  language?: Language;
};

export type UserProfileSectorOccupation = {
  businessSectorId?: string;
  businessSector?: BusinessSector;
  occupation?: Occupation;
  order: number;
};

export type Nudge = {
  id: string;
  value: HelpValue;
  nameRequest: string;
  nameOffer: string;
  order: number;
};

export type Interest = {
  id?: string;
  name: string;
  order: number;
};

export type UserProfileNudge = {
  id: string;
  createdAt: string;
  content: string | null;
  nudge?: Nudge;
};

export type Contract = {
  id: string;
  name: string;
};

export type UserProfile = {
  currentJob: string | null;
  description: string | null;
  introduction: string | null;
  department: Department;
  isAvailable: boolean;
  unavailabilityReason: string | null;
  nudges: Nudge[] | null;
  customNudges: UserProfileNudge[] | null;
  sectorOccupations?: UserProfileSectorOccupation[];
  lastSendMessage: string | null;
  lastReceivedMessage: string | null;
  linkedinUrl: string | null;
  hasExternalCv: boolean;
  hasAcceptedEthicsCharter: boolean;
  hasPicture: boolean;
  reviews: Review[];
  experiences: Experience[];
  formations: Formation[];
  skills: Skill[];
  userProfileLanguages: UserProfileLanguage[];
  interests: Interest[];
  contracts: Contract[];
  optinNewsletter: boolean;
  optInRecommendations: boolean;
  allowPhysicalEvents: boolean;
  allowRemoteEvents: boolean;
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

export type CompanyUser = {
  role: CompanyUserRole;
  isAdmin: boolean;
};

export type Company = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string | null;
  companyUser?: CompanyUser;
};

export type User = {
  coach: User;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
  adminRole: AdminRoles;
  password: string;
  salt: string;
  gender: Genders;
  phone: string;
  address: string;
  lastConnection: string;
  hashReset: string;
  saltReset: string;
  zone: AdminZone;
  whatsappZoneQR: string;
  whatsappZoneName: string;
  whatsappZoneUrl: string;
  organization: Organization;
  deletedAt?: string;
  userProfile: UserProfile;
  userSocialSituation: UserSocialSituation;
  OrganizationId?: string;
  readDocuments: { documentName: DocumentNameType }[];
  isEmailVerified: boolean;
  hasExtractedCvData?: boolean;
  companies?: Company[];
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
      gender: Genders;
      id: string;
    };
    employed: boolean;
    url: string;
    hidden: boolean;
    endOfContract?: string;
  };
  catchphrase: string;
  introduction: string;
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
  referredCandidates?: UserCandidateWithUsers[];
  averageDelayResponse?: number | null;
  responseRate?: number | null;
}

export type UserDto = {
  firstName: string;
  lastName: string;
  role: UserRoles;
  gender: Genders;
  zone: AdminZone;
  phone: string;
  email: string;
  adminRole?: AdminRoles;
  OrganizationId?: string;
  id?: string;
  userProfile?: UserProfile;
  lastConnection?: string;
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
  role: RegistrableUserRoles;
  campaign?: string;
  department: Department;
  nudges?: Nudge[];
  workingRight?: string;
  organizationId?: string;
  birthDate: string;
  occupations?: Occupation[];
  sectorOccupations?: UserProfileSectorOccupation[];
  materialInsecurity?: string;
  networkInsecurity?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  utmId?: string;
};

export type UserReferingDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  campaign?: string;
  department: Department;
  nudges?: Nudge[];
  workingRight?: string;
  birthDate: string;
  sectorOccupations?: UserProfileSectorOccupation[];
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
  role: UserRoles;
  department: Department;
  currentJob: string;
  description: string;
  introduction: string;
  isAvailable: boolean;
  customNudges: UserProfileNudge[];
  nudges: Nudge[];
  sectorOccupations: UserProfileSectorOccupation[];
  experiences: Experience[];
  formations: Formation[];
  skills: Skill[];
  userProfileLanguages: UserProfileLanguage[];
  interests: Interest[];
  reviews: Review[];
  contracts: Contract[];
  occupations: Occupation[];
  lastSentMessage: string;
  lastReceivedMessage: string;
  cvUrl?: string;
  hasExternalCv: boolean;
  averageDelayResponse: number | null;
  hasPicture: boolean;
};

export type PublicUser = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'role'
> & {
  userProfile: Pick<
    UserProfile,
    // Attributes
    | 'department'
    | 'description'
    | 'introduction'
    | 'linkedinUrl'
    | 'hasPicture'

    // Relations
    | 'sectorOccupations'
    | 'skills'
    | 'contracts'
    | 'userProfileLanguages'
    | 'nudges'
    | 'customNudges'
    | 'reviews'
    | 'experiences'
    | 'formations'
    | 'interests'
  >;
};

export type PrivateProfile = PublicProfile & {
  email: string;
  phone: string;
};

export type Profile = PublicProfile | PrivateProfile;

export type ProfilesFilters = {
  role: UserRoles[];
  search?: string;
  helps: HelpValue | HelpValue[];
  departments: Department | Department[];
  businessSectorIds: string | string[];
  contactTypes: ContactTypeEnum | ContactTypeEnum[];
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
