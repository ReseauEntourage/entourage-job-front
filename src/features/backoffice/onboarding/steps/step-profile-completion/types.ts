import { FilterConstant } from '@/src/constants/utils';

export interface ProfileCompletionFormValues {
  profileImage: Blob | null;
  profileImageObjectUrl: string | null;
  introduction: string;
  currentJob: string;
  companyName: FilterConstant<string> | null;
  businessSectorIds: FilterConstant<string>[];
  linkedinUrl: string;
  skills: FilterConstant<string>[];
  interests: FilterConstant<string>[];
}
