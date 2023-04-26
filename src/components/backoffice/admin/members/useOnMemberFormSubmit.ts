import { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';
import UIkit from 'uikit';
import Api from 'src/api';
import { UserDto } from 'src/api/types';
import { CREATE_NEW_ORGANIZATION_VALUE } from 'src/components/forms/schema/formAddUser';
import { USER_ROLES } from 'src/constants/users';
import { usePrevious } from 'src/hooks/utils';

export function useOnMemberFormSubmit(
  apiCall: (user: UserDto) => Promise<AxiosResponse>
) {
  const [filledUserFields, setFilledUserFields] = useState({});

  const prevFilledUserFields = usePrevious(filledUserFields);

  const onSubmit = useCallback(
    async (fields, closeModal) => {
      let userFields;
      let name;
      const shouldTryToCreateOrganization =
        fields.organizationId === CREATE_NEW_ORGANIZATION_VALUE;

      try {
        let { organizationId } = fields;

        if (shouldTryToCreateOrganization) {
          const organizationFields = {
            name: fields.nameOrganization,
            address: fields.addressOrganization,
            zone: fields.zoneOrganization,
            referentInformation: fields.referentInformationOrganization,
            referentFirstName: fields.referentFirstNameOrganization,
            referentLastName: fields.referentLastNameOrganization,
            referentPhone: fields.referentPhoneOrganization,
            referentMail: fields.referentMailOrganization,
          };

          try {
            ({
              data: { id: organizationId, name },
            } = await Api.postOrganization(organizationFields));

            UIkit.notification('La structure a bien été créé', 'success');
          } catch (error) {
            console.error(error);
            UIkit.notification(
              "Une erreur s'est produite lors de la création de la structure",
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
          userToLinkId: fields.userToLinkId,
          ...(fields.role === USER_ROLES.ADMIN
            ? { adminRole: fields.adminRole }
            : {}),
          ...(organizationId ? { OrganizationId: organizationId } : {}),
        };

        const { data } = await apiCall(userFields);
        setFilledUserFields({});
        closeModal();
        return data;
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 409) {
          UIkit.notification('Cette adresse email est déjà utilisée', 'danger');
        } else {
          UIkit.notification(
            "Une erreur s'est produite lors de la création du membre",
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
    [apiCall]
  );

  return {
    onSubmit,
    filledUserFields,
    prevFilledUserFields,
    setFilledUserFields,
  };
}
