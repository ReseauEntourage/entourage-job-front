import React, { useCallback, useMemo } from 'react';
import { Api } from 'src/api';
import { Organization, OrganizationDto } from 'src/api/types';
import { useOnOrganizationFormSubmit } from 'src/components/backoffice/admin/useOnOrganizationFormSubmit';
import { formAddOrganization } from 'src/components/forms/schemas/formAddOrganization';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Actions } from 'src/constants/utils';

interface EditOrganizationModalProps {
  organization: Organization;
  refreshOrganizations: () => void;
}
export function EditOrganizationModal({
  organization,
  refreshOrganizations,
}: EditOrganizationModalProps) {
  const { onSubmit } = useOnOrganizationFormSubmit(
    async (organizationToUpdate: OrganizationDto) => {
      return Api.putOrganization(
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        organization.id,
        organizationToUpdate
      );
    },
    Actions.UPDATE
  );

  const handleMemberUpdateSubmit = useCallback(
    async (fields, closeModal) => {
      await onSubmit(fields, closeModal);
      await refreshOrganizations();
    },
    [onSubmit, refreshOrganizations]
  );

  const updateUserModalProps = useMemo(() => {
    return {
      formId: formAddOrganization.id,
      formSchema: formAddOrganization,
      title: "Edition d'une structure partenaire",
      description:
        'Merci de modifier les informations que vous souhaitez concernant la structure.',
      submitText: 'Modifier la structure',
      onSubmit: handleMemberUpdateSubmit,
      defaultValues: { ...organization, ...organization.organizationReferent },
    };
  }, [handleMemberUpdateSubmit, organization]);

  return <ModalEdit {...updateUserModalProps} />;
}
