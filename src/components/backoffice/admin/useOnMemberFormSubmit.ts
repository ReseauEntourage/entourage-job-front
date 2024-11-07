import { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from 'src/api';
import { UserDto } from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import {
  CREATE_NEW_ORGANIZATION_VALUE,
  formAddUser,
} from 'src/components/forms/schemas/formAddUser';
import { USER_ROLES } from 'src/constants/users';
import { Action, ActionsLabels } from 'src/constants/utils';
import { usePrevious } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';

export function useOnMemberFormSubmit(
  apiCall: (user: UserDto) => Promise<AxiosResponse>,
  action: Action
) {
  const [filledUserFields, setFilledUserFields] = useState({});
  const dispatch = useDispatch();

  const prevFilledUserFields = usePrevious(filledUserFields);

  const onSubmit = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formAddUser>,
      closeModal
    ) => {
      let userFields: UserDto;
      let name: string;
      const shouldTryToCreateOrganization =
        fields.organizationId?.value === CREATE_NEW_ORGANIZATION_VALUE;

      try {
        let organizationId = fields.organizationId?.value;

        if (shouldTryToCreateOrganization) {
          const organizationFields = {
            name: fields.nameOrganization,
            address: fields.addressOrganization,
            zone: fields.zoneOrganization,
            referentFirstName: fields.referentFirstNameOrganization,
            referentLastName: fields.referentLastNameOrganization,
            referentPhone: fields.referentPhoneOrganization,
            referentMail: fields.referentMailOrganization,
          };

          try {
            ({
              data: { id: organizationId },
            } = await Api.postOrganization(organizationFields));

            name = fields.nameOrganization;

            dispatch(
              notificationsActions.addNotification({
                type: 'success',
                message: 'La structure a bien été créée',
              })
            );
          } catch (error) {
            console.error(error);
            dispatch(
              notificationsActions.addNotification({
                type: 'danger',
                message:
                  "Une erreur s'est produite lors de la création de la structure",
              })
            );
            return;
          }
        }

        userFields = {
          firstName: fields.firstName,
          lastName: fields.lastName,
          gender: fields.gender,
          zone: fields.zone,
          phone: fields.phone,
          role: fields.role,
          email: fields.email,
          ...(fields.userToLinkId
            ? {
                userToLinkId: fields.userToLinkId.value,
              }
            : {}),
          ...(fields.role === USER_ROLES.ADMIN
            ? { adminRole: fields.adminRole }
            : {}),
          ...(organizationId ? { OrganizationId: organizationId } : {}),
        };

        const { data } = await apiCall(userFields);
        setFilledUserFields({});
        closeModal();
        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: `Le membre a bien été ${ActionsLabels[action].VERB}`,
          })
        );
        return data;
      } catch (error) {
        console.error(error);
        if (
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          error?.response?.status === 409
        ) {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: 'Cette adresse email est déjà utilisée',
            })
          );
        } else {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: `Une erreur s'est produite lors de la ${ActionsLabels[action].NAME} du membre`,
            })
          );
        }

        if (shouldTryToCreateOrganization) {
          const { OrganizationId, ...restUserFields } =
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            userFields;

          setFilledUserFields({
            ...restUserFields,
            organizationId: {
              value: OrganizationId,
              label:
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                name,
            },
          });
          closeModal();
        }
      }
    },
    [action, apiCall, dispatch]
  );

  return {
    onSubmit,
    filledUserFields,
    prevFilledUserFields,
    setFilledUserFields,
  };
}
