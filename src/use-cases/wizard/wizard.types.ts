import { UserProfileSectorOccupation } from 'src/api/types';

export type WizardSubStep =
  | '1.1-nudges'
  | '1.2-metiers-secteurs'
  | '1.3-personal-info'
  | '1.4-account'
  | '1.5-otp'
  | '2.1-elearning'
  | '3.1-social-situation'
  | 'done';

export type RequestStatus = 'IDLE' | 'REQUESTED' | 'SUCCEEDED' | 'FAILED';

export type OtpError = 'INVALID_CODE' | 'EXPIRED' | 'MAX_ATTEMPTS';

export type PanelState = 'teaser' | 'loading' | 'results';

export interface SuggestedProfile {
  userId: string;
  firstName: string;
  lastName: string;
  city: string | null;
  isAvailable: boolean;
  mainSector: string | null;
}

export interface WizardFormData {
  role: string;
  flow: string;
  invitationId?: string;
  companyName?: string;
  // Step 1.1
  nudges?: string[];
  // Step 1.2
  sectorOccupations?: UserProfileSectorOccupation[];
  // Step 1.3
  firstName?: string;
  lastName?: string;
  gender?: number;
  birthDate?: string;
  phone?: string;
  department?: { value: string; label: string };
  workingRight?: string;
  // Step 1.4
  email?: string;
  password?: string;
  optInNewsletter?: boolean;
}
