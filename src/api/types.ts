import { CompanyGoal, CompanyUserRole } from '../constants/company';
import { ContactTypeEnum } from '../constants/contactTypes';
import { EventMode, EventType } from '../constants/events';
import { Genders } from '../constants/genders';
import { OnboardingStatus } from '../constants/onboarding';
import {
  CompanyApproach,
  Contract as ContractValue,
  HeardAboutValue,
  WorkingExperience,
} from 'src/constants';
import { AdminZone, DepartmentName } from 'src/constants/departements';
import { RegistrableUserRoles, UserRoles } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';

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
  RECRUITEMENT_ALERTS: 'recruitement-alerts',
  ELEARNING: 'elearning',
} as const;

export type APIRoute = (typeof APIRoutes)[keyof typeof APIRoutes];

export type Route<T extends APIRoute> = `/${T}/${string}` | `/${T}`;

export type Department = {
  id: string;
  name: string;
  value: string;
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
  id: string;
  businessSectorId?: string;
  businessSector?: BusinessSector;
  occupation?: Occupation;
  order: number;
};

export type Nudge = {
  id: string;
  value: string;
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
  department: DepartmentName;
  isAvailable: boolean;
  unavailabilityReason: string | null;
  nudges: Nudge[] | null;
  customNudges: UserProfileNudge[] | null;
  sectorOccupations?: UserProfileSectorOccupation[];
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

export type Event = {
  salesForceId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: EventType;
  participantsCount: number;
  registrationCount: number;
  mode: EventMode;
  meetingLink: string | null;
  fullAddress: string | null;
  duration: number | null;
  format: string;
  goal: string;
  audience: string;
  sequences?: string[];
  isParticipating: boolean;
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

export type Invitation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  userId?: string;
  companyId?: string;
};

export type Company = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string | null;
  companyUser?: CompanyUser;
  logoUrl?: string;
  pendingInvitations?: Invitation[];
  businessSectors?: BusinessSector[];
  department: Department;
  url?: string | null;
  hiringUrl?: string | null;
  linkedInUrl?: string | null;
  goal: CompanyGoal | null;
  admin: {
    firstName: string;
    lastName: string;
  } | null;
};

export type CompaniesFilters = {
  search?: string;
  departments: string[];
  businessSectorIds: string[];
  onlyWithReferent: boolean;
};

export type ReadDocumentItem = {
  documentName: string;
  createdAt: string;
};

export type UserStats = {
  createdAt: string;
  averageDelayResponse: number | null;
  responseRate: number | null;
  totalConversationWithMirrorRoleCount: number | null;
};

export type User = {
  id: string;
  createdAt?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
  gender: Genders;
  phone: string;
  lastConnection: string;
  zone: AdminZone;
  OrganizationId?: string;
  isEmailVerified: boolean;
  userSocialSituation: UserSocialSituation;
  onboardingStatus: OnboardingStatus;
  onboardingCompletedAt: string | null;
  onboardingWebinarSkippedAt: string | null;
};

export type MemberUser = User & {
  userProfile?: { hasPicture: boolean; currentJob?: string | null } | null;
  organization?: { id: string; name: string } | null;
  referredCandidates?: User[];
};

export type WhatsappZone = {
  name: string;
  url: string;
  qr: string;
};

export enum AchievementType {
  SUPER_ENGAGED_COACH = 'super_engaged_coach',
}

export type UserAchievement = {
  id: string;
  createdAt: string;
  title: string;
  achievementType: AchievementType;
};

export type CriterionStat = {
  key: string;
  label: string;
  currentValue: number;
  threshold: number;
  isPercentage?: boolean;
};

export type AchievementProgressionEntry = {
  type: AchievementType;
  label: string;
  hasAchievement: boolean;
  /** ISO date string of when the badge was obtained, null if not yet obtained. */
  achievedAt: string | null;
  /** ISO date string of when the badge expires, null if not yet obtained. */
  expireAt: string | null;
  /** Rolling window (in months) over which the criteria stats are computed. */
  statsWindowMonths: number;
  criteria: CriterionStat[];
};

export type StaffContact = {
  name: string;
  email: string;
  img: string;
};

export type CurrentUserIdentity = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRoles;
  zone: AdminZone;
  gender: Genders;
  lastConnection: string;
  isEmailVerified: boolean;
  OrganizationId: string | null;
  onboardingStatus: OnboardingStatus;
  onboardingCompletedAt: string | null;
  onboardingWebinarSkippedAt: string | null;
};

export type CurrentUserProfile = {
  id: string;
  hasPicture: boolean;
  hasExternalCv: boolean;
  description: string | null;
  introduction: string | null;
  linkedinUrl: string | null;
  department: DepartmentName | null;
  isAvailable: boolean;
  currentJob: string | null;
  optInRecommendations: boolean;
  nudges: UserProfile['nudges'];
  sectorOccupations: UserProfile['sectorOccupations'];
  allowPhysicalEvents: boolean;
  allowRemoteEvents: boolean;
};

export type CurrentUserProfileComplete = CurrentUserProfile & {
  experiences: UserProfile['experiences'];
  formations: UserProfile['formations'];
  skills: UserProfile['skills'];
  contracts: UserProfile['contracts'];
  reviews: UserProfile['reviews'];
  interests: UserProfile['interests'];
  customNudges: UserProfile['customNudges'];
  userProfileLanguages: UserProfile['userProfileLanguages'];
  hasExtractedCvData: boolean;
};

export type CurrentUserCompany = {
  id: string;
  name: string;
  description: string | null;
  goal: CompanyGoal | null;
  url: string | null;
  hiringUrl: string | null;
  linkedInUrl: string | null;
  logoUrl: string | null;
  businessSectors: BusinessSector[];
  department: Department | null;
  companyUser: {
    isAdmin: boolean;
    role: CompanyUserRole | null;
  };
} | null;

export type CurrentUserOrganization = {
  id: string;
  name: string;
  address: string | null;
  zone: AdminZone;
} | null;

export type CurrentUserReferredUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  email: string;
  coachesContactedCount: number;
  referredAt: string | null;
  accountCreatedAt: string | null;
};

export type CurrentUserReferrer = {
  referer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
};

export type EventParticipant = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'role'
> & {
  userProfile: Pick<UserProfile, 'hasPicture'>;
};

export type EventWithParticipants = Event & {
  participants: EventParticipant[];
};

export type UserDto = {
  firstName: string;
  lastName: string;
  role: UserRoles;
  gender: Genders;
  zone: AdminZone;
  phone: string;
  email: string;
  OrganizationId?: string;
  id?: string;
  userProfile?: UserProfile;
  lastConnection?: string;
  onboardingStatus?: OnboardingStatus;
  onboardingWebinarSkippedAt?: string | null;
};

export type UserRegistrationDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: RegistrableUserRoles;
  campaign?: string;
  department: DepartmentName;
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
  department: DepartmentName;
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

export type UpdateCompanyDto = {
  name?: string;
  description?: string;
  logo?: File;
  departmentId?: string;
  url?: string | null;
  linkedInUrl?: string | null;
  hiringUrl?: string | null;
  goal?: CompanyGoal;
  businessSectorIds?: string[];
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
  'id' | 'firstName' | 'lastName' | 'role' | 'gender' | 'zone' | 'email'
> & {
  userProfile: Pick<UserProfile, 'hasPicture' | 'isAvailable'> | null;
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
  gender: Genders;
  department: DepartmentName;
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
  cvUrl?: string;
  hasExternalCv: boolean;
  hasPicture: boolean;
  company: Company | null;
  lastConnection: string;
  achievements: UserAchievement[];
} & UserStats;

export type PublicCV = Pick<User, 'id' | 'firstName' | 'lastName' | 'role'> & {
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

export type MatchingReason =
  | 'profile'
  | 'needs'
  | 'activity'
  | 'locationCompatibility';

export type ProfileRecommendation = {
  id: string;
  publicProfile: PublicProfile;
  reason: MatchingReason | null;
};

export type ProfileRecommendationPage = {
  recommendations: ProfileRecommendation[];
  nextCursor: number | null;
};

export type PrivateProfile = PublicProfile & {
  email: string;
  phone: string;
};

export type Profile = PublicProfile | PrivateProfile;

export type ProfilesFilters = {
  role: UserRoles;
  search?: string;
  nudgeIds: string | string[];
  departments: string | string[];
  businessSectorIds: string | string[];
  contactTypes: ContactTypeEnum | ContactTypeEnum[];
  isAvailable?: boolean;
  sort?: string;
  hasSuperCoachBadge?: boolean;
};

export type EventsFilters = {
  eventTypes: EventType | EventType[];
  search?: string;
  departmentIds: string | string[];
  modes?: EventMode | EventMode[];
  isParticipating?: boolean;
  includePastEvents?: boolean;
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

export type RecruitementAlert = {
  id: string;
  name: string;
  jobName: string;
  department: DepartmentName | null;
  workingExperienceYears: WorkingExperience | null;
  contractType: ContractValue | null;
  companyId: string;
  businessSectors?: BusinessSector[];
  skills?: Skill[];
  createdAt: string;
  updatedAt: string;
};

export type RecruitementAlertDto = {
  companyId: string;
  name: string;
  jobName: string;
  department: DepartmentName | null;
  businessSectorIds?: string[];
  workingExperienceYears: WorkingExperience | null;
  contractType: ContractValue | null;
  skills?: FilterConstant<string>[];
};

export type UserWithCompanyAndConversations = User & {
  conversations: Conversation[];
  companyUser: CompanyUser;
  userProfile?: Pick<
    UserProfile,
    'hasPicture' | 'isAvailable' | 'currentJob' | 'sectorOccupations'
  > | null;
  achievements?: UserAchievement[];
  invitations?: Invitation[];
};

export type CompanyWithUsers = Company & {
  users: UserWithCompanyAndConversations[];
  pendingInvitations: Invitation[];
};

export type AiAssistantMessageRole = 'user' | 'assistant';

export type AiAssistantMessage = {
  id: string;
  role: AiAssistantMessageRole;
  content: string;
  createdAt?: string;
};

export type AiAssistantSession = {
  messages: AiAssistantMessage[];
};
