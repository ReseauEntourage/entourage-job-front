import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { companyActions } from '../use-cases/company';
import {
  selectIsFetchCompanySelectors,
  selectIsFetchCompanyWithCollaboratorsSelectors,
  selectSelectedCompany,
  selectSelectedCompanyWithCollaborators,
} from '../use-cases/company/company.selectors';

export function useSelectedCompany() {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const companyId = query.companyId as string;
  const selectedCompany = useSelector(selectSelectedCompany);
  const selectedCompanyWithCollaborators = useSelector(
    selectSelectedCompanyWithCollaborators
  );
  const isFetchCompanyRequested = useSelector(
    selectIsFetchCompanySelectors.selectIsFetchSelectedCompanyRequested
  );
  const isFetchCompanyWithCollaboratorsRequested = useSelector(
    selectIsFetchCompanyWithCollaboratorsSelectors.selectIsFetchSelectedCompanyWithCollaboratorsRequested
  );

  useEffect(() => {
    if (companyId) {
      dispatch(companyActions.setSelectedCompanyId(companyId));
    }
  }, [companyId, dispatch]);

  useEffect(() => {
    if (companyId && selectedCompany?.id !== companyId) {
      dispatch(companyActions.fetchSelectedCompanyRequested());
    }
  }, [companyId, selectedCompany, dispatch]);

  return {
    companyId,
    selectedCompany,
    selectedCompanyWithCollaborators,
    isFetchCompanyRequested,
    isFetchCompanyWithCollaboratorsRequested,
  };
}
