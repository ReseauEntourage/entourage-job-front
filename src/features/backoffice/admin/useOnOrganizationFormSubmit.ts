import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { OrganizationDto } from 'src/api/types';
import { Action, ActionsLabels } from 'src/constants/utils';
import { ExtractFormSchemaValidation } from 'src/features/forms/FormSchema';
import { formAddOrganization } from 'src/features/forms/schemas/formAddOrganization';
import { notificationsActions } from 'src/use-cases/notifications';

export function useOnOrganizationFormSubmit(
  apiCall: (organization: OrganizationDto) => Promise<AxiosResponse>,
  action: Action
) {
  const dispatch = useDispatch();
  const onSubmit = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formAddOrganization>,
      closeModal
    ) => {
      try {
        const { data } = await apiCall(fields);
        closeModal();
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: `La structure a bien été ${ActionsLabels[action].VERB}e`,
          })
        );
        return data;
      } catch (error) {
        console.error(error);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: `Une erreur s'est produite lors de la ${ActionsLabels[action].NAME} de la structure`,
          })
        );
      }
    },
    [action, apiCall, dispatch]
  );

  return {
    onSubmit,
  };
}
