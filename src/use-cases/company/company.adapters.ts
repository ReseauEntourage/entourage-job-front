import { CompanyWithUsers, UpdateCompanyDto } from '@/src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export type FetchSelectedCompanyError = 'FETCH_FAILED';
export type updateCompanyLogoError = 'UPDATE_LOGO_FAILED';
export type updateCompanyError = 'UPDATE_FAILED';

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

export const updateCompanyAdapter = createRequestAdapter(
  'updateCompany'
).withPayloads<
  {
    companyData: Partial<UpdateCompanyDto>;
  },
  void,
  updateCompanyError | null
>();
