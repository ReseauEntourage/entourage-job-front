export type SocialMedia = 'facebook' | 'linkedin' | 'twitter';

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

export type ContactNewsletter = {
  email: string;
  zone?: string;
  status?: string;
  visit?: string;
  visitor?: string;
  urlParams?: {
    utm?: string;
    utm_medium?: string;
    utm_source?: string;
    gclid?: string;
    referer?: string;
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