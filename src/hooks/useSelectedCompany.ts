import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { companyActions } from '../use-cases/company';
import {
  selectIsFetchCompanySelectors,
  selectSelectedCompany,
} from '../use-cases/company/company.selectors';

export function useSelectedCompany() {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const companyId = query.companyId as string;
  const selectedCompany = useSelector(selectSelectedCompany);
  const isFetchCompanyRequested = useSelector(
    selectIsFetchCompanySelectors.selectIsFetchSelectedCompanyRequested
  );

  useEffect(() => {
    if (companyId) {
      dispatch(companyActions.setSelectedCompanyId(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (companyId && !selectedCompany) {
      dispatch(companyActions.fetchSelectedCompanyRequested());
    }
  }, [companyId, selectedCompany, dispatch]);

  return {
    selectedCompany,
    isFetchCompanyRequested,
  };
}
