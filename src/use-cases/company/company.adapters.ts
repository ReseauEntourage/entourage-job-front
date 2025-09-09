import {
  CompaniesFilters,
  CompanyWithUsers,
  UpdateCompanyDto,
} from '@/src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export type updateCompanyLogoError = 'UPDATE_LOGO_FAILED';
export type updateCompanyError = 'UPDATE_FAILED';

export const fetchCompaniesAdapter = createRequestAdapter(
  'fetchCompanies'
).withPayloads<CompaniesFilters, CompanyWithUsers[]>();

export const fetchSelectedCompanyAdapter = createRequestAdapter(
  'fetchSelectedCompany'
).withPayloads<void, CompanyWithUsers>();

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
