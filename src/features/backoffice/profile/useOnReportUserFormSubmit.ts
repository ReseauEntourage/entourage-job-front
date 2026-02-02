import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { UserReportDto } from 'src/api/types';
import { Action, ActionsLabels } from 'src/constants/utils';
import { ExtractFormSchemaValidation } from 'src/features/forms/FormSchema';
import { formReportUser } from 'src/features/forms/schemas/formReportUser';
import { notificationsActions } from 'src/use-cases/notifications';

export function useOnReportUserFormSubmit(
  apiCall: (organization: UserReportDto) => Promise<AxiosResponse>,
  action: Action
) {
  const dispatch = useDispatch();
  const onSubmit = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formReportUser>,
      closeModal
    ) => {
      try {
        const { data } = await apiCall(fields);
        closeModal();
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: `Le signalement a bien été ${ActionsLabels[action].VERB}e`,
          })
        );
        return data;
      } catch (error) {
        console.error(error);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: `Une erreur s'est produite lors de la ${ActionsLabels[action].NAME} du signalement`,
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
