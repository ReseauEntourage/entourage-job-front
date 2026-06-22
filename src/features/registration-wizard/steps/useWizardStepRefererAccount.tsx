import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import {
  formRegistrationRefererAccount,
  CREATE_NEW_ORGANIZATION_VALUE,
} from '@/src/features/registration/forms/formRegistrationRefererAccount';
import { WizardStep } from '@/src/features/wizard-shell/wizard.types';
import {
  registrationActions,
  selectRegistrationData,
} from '@/src/use-cases/registration';
import { Api } from 'src/api';
import { OrganizationDto } from 'src/api/types';
import { DEPARTMENTS } from 'src/constants/departements';
import { notificationsActions } from 'src/use-cases/notifications';

export function useWizardStepRefererAccount() {
  const dispatch = useDispatch();
  const data = useSelector(selectRegistrationData);
  const formRef = useRef<FormWithValidationRef>(null);

  const handleFormSubmit = useCallback(
    async (fields: Record<string, unknown>) => {
      const typedFields = fields as {
        organizationId: { value: string; label: string };
        nameOrganization?: string;
        department: { value: string };
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        acceptCGU: boolean;
        confirmPassword: string;
        [key: string]: unknown;
      };

      // Handle organization creation if needed
      if (typedFields.organizationId?.value === CREATE_NEW_ORGANIZATION_VALUE) {
        const { nameOrganization } = typedFields;
        const organizationFields = {
          name: nameOrganization ?? '',
          zone: DEPARTMENTS.find(
            (d) => d.name === typedFields.department?.value
          )?.zone,
          referentFirstName: typedFields.firstName,
          referentLastName: typedFields.lastName,
          referentPhone: typedFields.phone,
          referentMail: typedFields.email,
        };

        try {
          const {
            data: { id: newOrgId, name: newOrgName },
          } = await Api.postOrganization(organizationFields as OrganizationDto);
          typedFields.organizationId = {
            label: newOrgName as string,
            value: newOrgId,
          };
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur s'est produite lors de la création de l'association",
            })
          );
          return;
        }
      }

      const {
        acceptCGU,
        confirmPassword,
        nameOrganization,
        ...registrationFields
      } = typedFields;

      dispatch(registrationActions.setRegistrationIsEnded(true));
      dispatch(
        registrationActions.moveForwardInRegistration({
          data: registrationFields as any,
        })
      );
      dispatch(registrationActions.createUserRequested());
    },
    [dispatch]
  );

  const step: WizardStep = {
    smallTitle: 'Mon compte',
    summary: { title: 'Mon compte', duration: '~3 minutes' },
    hideGenericStepHeader: undefined,
    title: 'Créez votre compte Entourage Pro',
    description:
      'Renseignez vos coordonnées et votre association pour finaliser votre inscription.',
    content: (
      <FormWithValidation
        formSchema={formRegistrationRefererAccount}
        defaultValues={(data as any) || {}}
        onSubmit={handleFormSubmit}
        noFooter
        innerRef={formRef}
      />
    ),
    onSubmit: async () => {
      const success = await formRef.current?.submit();
      return success === false ? false : undefined;
    },
  };

  return { step };
}
