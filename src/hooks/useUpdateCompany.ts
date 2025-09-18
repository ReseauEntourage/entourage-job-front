import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '../constants';
import { UpdateCompanyDto } from 'src/api/types';
import { companyActions, updateCompanySelectors } from 'src/use-cases/company';

export const useUpdateCompany = () => {
  const dispatch = useDispatch();
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const updateCompanyStatus = useSelector(
    updateCompanySelectors.selectUpdateCompanyStatus
  );

  useEffect(() => {
    if (updateCompanyStatus === ReduxRequestEvents.SUCCEEDED) {
      setCloseModal(true);
    }
  }, [updateCompanyStatus]);

  const updateCompany = useCallback(
    (newCompanyData: Partial<UpdateCompanyDto>): void => {
      if (!_.isEmpty(newCompanyData)) {
        dispatch(
          companyActions.updateCompanyRequested({
            companyData: newCompanyData,
          })
        );
      } else {
        setCloseModal(true);
      }
    },
    [dispatch]
  );

  return {
    updateCompany,
    closeModal,
  };
};
