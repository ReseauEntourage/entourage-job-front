import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import UIkit from 'uikit';
import { OrganizationDto } from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formAddOrganization } from 'src/components/forms/schemas/formAddOrganization';
import { Action, ActionsLabels } from 'src/constants/utils';

export function useOnOrganizationFormSubmit(
  apiCall: (organization: OrganizationDto) => Promise<AxiosResponse>,
  action: Action
) {
  const onSubmit = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formAddOrganization>,
      closeModal
    ) => {
      try {
        const { data } = await apiCall(fields);
        closeModal();
        UIkit.notification(
          `La structure a bien été ${ActionsLabels[action].VERB}e`,
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
