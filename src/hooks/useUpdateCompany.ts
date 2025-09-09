import useChange from '@react-hook/change';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currentUserActions } from '../use-cases/current-user';
import { notificationsActions } from '../use-cases/notifications';
import { UpdateCompanyDto } from 'src/api/types';
import { ReduxRequestEvents } from 'src/constants';
import { companyActions, updateCompanySelectors } from 'src/use-cases/company';

export const useUpdateCompany = () => {
  const dispatch = useDispatch();

  const [closeModal, setCloseModal] = useState<boolean>(false);

  const updateCompanyStatus = useSelector(
    updateCompanySelectors.selectUpdateCompanyStatus
  );

  useChange(updateCompanyStatus, () => {
    if (updateCompanyStatus === ReduxRequestEvents.SUCCEEDED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: 'Votre entreprise a été mise à jour avec succès',
        })
      );
      dispatch(currentUserActions.fetchUserRequested());
      setCloseModal(true);
    }
    if (updateCompanyStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: 'Une erreur est survenue',
        })
      );
    }
  });

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
