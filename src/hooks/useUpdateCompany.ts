import _ from 'lodash';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { UpdateCompanyDto } from 'src/api/types';
import { companyActions } from 'src/use-cases/company';

export const useUpdateCompany = () => {
  const dispatch = useDispatch();
  const [closeModal, setCloseModal] = useState<boolean>(false);

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
