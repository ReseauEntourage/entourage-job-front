import { CompanyWithUsers } from '@/src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export type FetchSelectedCompanyError = 'FETCH_FAILED';
export type updateCompanyLogoError = 'UPDATE_FAILED';

export const fetchSelectedCompanyAdapter = createRequestAdapter(
  'fetchSelectedCompany'
).withPayloads<void, CompanyWithUsers, FetchSelectedCompanyError | null>();

export const updateCompanyLogoAdapter = createRequestAdapter(
  'updateCompanyLogo'
).withPayloads<
  {
    companyId: string;
    logoFile: File;
  },
  void,
  updateCompanyLogoError | null
>();
