import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import UIkit from 'uikit';
import { OrganizationDto } from 'src/api/types';
import { Action, ActionsLabels } from 'src/constants/utils';

export function useOnOrganizationFormSubmit(
  apiCall: (user: OrganizationDto) => Promise<AxiosResponse>,
  action: Action
) {
  const onSubmit = useCallback(
    async (fields, closeModal) => {
      try {
        const { data } = await apiCall(fields);
        closeModal();
        UIkit.notification(
          `La structure a bien été ${ActionsLabels[action].VERB}`,
          'success'
        );
        return data;
      } catch (error) {
        console.error(error);
        UIkit.notification(
          `Une erreur s'est produite lors de la ${ActionsLabels[action].NAME} de la structure`,
          'danger'
        );
      }
    },
    [action, apiCall]
  );

  return {
    onSubmit,
  };
}
