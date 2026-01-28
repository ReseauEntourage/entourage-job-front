import { StaffContact, User, UserProfile } from 'src/api/types';
import { DocumentNameType } from 'src/constants';
import { createRequestAdapter } from 'src/store/utils';

export const fetchUserAdapter = createRequestAdapter('fetchUser').withPayloads<
  void,
  User
>();

export const fetchStaffContactAdapter = createRequestAdapter(
  'fetchStaffContact'
).withPayloads<void, StaffContact>();

export const fetchCompleteUserAdapter = createRequestAdapter(
  'fetchCompleteUser'
).withPayloads<void, User>();

export type UpdateError = 'UPDATE_FAILED';

export const NOT_AUTHENTICATED_USER = 'User is not authenticated';

export const updateUserAdapter = createRequestAdapter(
  'updateUser'
).withPayloads<
  {
    userId: string;
    user: Partial<User>;
  },
  { user: Partial<User> },
  {
    error: UpdateError;
  }
>();

export const updateOnboardingStatusAdapter = createRequestAdapter(
  'updateOnboardingStatus'
).withPayloads<
  {
    onboardingStatus: User['onboardingStatus'];
  },
  { onboardingStatus: User['onboardingStatus'] },
  {
    error: UpdateError;
  }
>();

export const forceOnboardingAsCompletedAdapter = createRequestAdapter(
  'forceOnboardingAsCompleted'
).withPayloads<
  void,
  { onboardingStatus: User['onboardingStatus'] },
  { error: UpdateError }
>();

export const updateUserCompanyAdapter = createRequestAdapter(
  'updateUserCompany'
).withPayloads<
  {
    companyName: string | null;
  },
  void,
  {
    error: UpdateError;
  }
>();

export const updateProfileAdapter = createRequestAdapter(
  'updateProfile'
).withPayloads<
  {
    userId: string;
    userProfile: Partial<UserProfile>;
  },
  { userProfile: Partial<UserProfile> },
  {
    error: UpdateError;
  }
>();

export const readDocumentAdapter = createRequestAdapter(
  'readDocument'
).withPayloads<
  {
    documentName: DocumentNameType;
  },
  void
>();

export const updateUserProfilePictureAdapter = createRequestAdapter(
  'updateUserProfilePicture'
).withPayloads<
  {
    profileImage: Blob;
  },
  void
>();

export const uploadExternalCvAdapter = createRequestAdapter(
  'uploadExternalCv'
).withPayloads<
  { formData: FormData },
  void,
  {
    error: string;
  }
>();
