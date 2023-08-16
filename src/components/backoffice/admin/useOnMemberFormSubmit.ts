import { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';
import UIkit from 'uikit';
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

export function useOnMemberFormSubmit(
  apiCall: (user: UserDto) => Promise<AxiosResponse>,
  action: Action
) {
  const [filledUserFields, setFilledUserFields] = useState({});

  const prevFilledUserFields = usePrevious(filledUserFields);

  const onSubmit = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formAddUser>,
      closeModal
    ) => {
      let userFields: UserDto;
      let name: string;
      const shouldTryToCreateOrganization =
        fields.organizationId.value === CREATE_NEW_ORGANIZATION_VALUE;

      try {
        let { organizationId } = fields;

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

            UIkit.notification(`La structure a bien été créée`, 'success');
          } catch (error) {
            console.error(error);
            UIkit.notification(
              `Une erreur s'est produite lors de la création de la structure`,
              'danger'
            );
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
          userToLinkId: Array.isArray(fields.userToLinkId)
            ? fields.userToLinkId.map(({ value }) => value)
            : fields.userToLinkId.value,
          ...(fields.role === USER_ROLES.ADMIN
            ? { adminRole: fields.adminRole }
            : {}),
          ...(organizationId ? { OrganizationId: organizationId.value } : {}),
        };

        const { data } = await apiCall(userFields);
        setFilledUserFields({});
        closeModal();
        UIkit.notification(
          `Le membre a bien été ${ActionsLabels[action].VERB}`,
          'success'
        );
        return data;
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 409) {
          UIkit.notification('Cette adresse email est déjà utilisée', 'danger');
        } else {
          UIkit.notification(
            `Une erreur s'est produite lors de la ${ActionsLabels[action].NAME} du membre`,
            'danger'
          );
        }

        if (shouldTryToCreateOrganization) {
          const { OrganizationId, ...restUserFields } = userFields;

          setFilledUserFields({
            ...restUserFields,
            organizationId: { value: OrganizationId, label: name },
          });
          closeModal();
        }
      }
    },
    [action, apiCall]
  );

  return {
    onSubmit,
    filledUserFields,
    prevFilledUserFields,
    setFilledUserFields,
  };
}
