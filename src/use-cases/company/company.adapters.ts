import { CompanyWithUsers } from '@/src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export type FetchSelectedCompanyError = 'FETCH_FAILED';

export const fetchSelectedCompanyAdapter = createRequestAdapter(
  'fetchSelectedCompany'
).withPayloads<void, CompanyWithUsers, FetchSelectedCompanyError | null>();
