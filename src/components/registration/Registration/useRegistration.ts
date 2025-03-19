import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  REGISTRATION_CONFIRMATION_STEP,
  RegistrationFormData,
  FlattenedRegistrationFormData,
  RegistrationFormWithOrganizationField,
} from '../Registration.types';
import { CREATE_NEW_ORGANIZATION_VALUE } from '../forms/formRegistrationRefererAccount';
import { Api } from 'src/api';
import { OrganizationDto } from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { ReduxRequestEvents } from 'src/constants';
import { DEPARTMENTS } from 'src/constants/departements';
import { Programs } from 'src/constants/programs';
import { RegistrableUserRole } from 'src/constants/users';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  createUserSelectors,
  registrationActions,
  selectCreateUserError,
  selectIsFirstRegistrationStep,
  selectIsLastRegistrationStep,
  selectIsRegistrationLoading,
  selectRegistrationCurrentStepContent,
  selectRegistrationCurrentStepData,
  selectRegistrationDataFromOtherStep,
  selectRegistrationNextStep,
  selectRegistrationSelectedProgram,
  selectRegistrationSelectedRole,
  selectRegistrationShouldSkipStep,
} from 'src/use-cases/registration';

export function useRegistration() {
  const { push, back, replace } = useRouter();
  const dispatch = useDispatch();

  const isRegistrationLoading = useSelector(selectIsRegistrationLoading);

  const stepData = useSelector(selectRegistrationCurrentStepData);
  const stepContent = useSelector(selectRegistrationCurrentStepContent);
  const valuesFromOtherStep = useSelector(selectRegistrationDataFromOtherStep);
  const isFirstRegistrationStep = useSelector(selectIsFirstRegistrationStep);
  const isLastRegistrationStep = useSelector(selectIsLastRegistrationStep);
  const nextStep = useSelector(selectRegistrationNextStep);
  const shouldSkipStep = useSelector(selectRegistrationShouldSkipStep);

  const selectedRole = useSelector(selectRegistrationSelectedRole);
  const selectedProgram = useSelector(selectRegistrationSelectedProgram);

  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );
  const createUserError = useSelector(selectCreateUserError);

  const onSubmitStepForm = useCallback(
    async (fields: RegistrationFormData) => {
      const fieldsKeys = Object.keys(fields);

      // Handle organizationId field
      if (fieldsKeys.includes('organizationId')) {
        const fieldsWithOrganisation =
          fields as ExtractFormSchemaValidation<RegistrationFormWithOrganizationField>;
        const shouldTryToCreateOrganization =
          fieldsWithOrganisation.organizationId.value ===
          CREATE_NEW_ORGANIZATION_VALUE;

        // Create organization if needed
        if (shouldTryToCreateOrganization) {
          let { nameOrganization } = fieldsWithOrganisation;
          const organizationFields = {
            name: nameOrganization,
            zone: DEPARTMENTS.find((deptObj) => {
              return deptObj.name === fieldsWithOrganisation.department.value;
            })?.zone,
            referentFirstName: fieldsWithOrganisation.firstName,
            referentLastName: fieldsWithOrganisation.lastName,
            referentPhone: fieldsWithOrganisation.phone,
            referentMail: fieldsWithOrganisation.email,
          } as OrganizationDto;

          let newOrganizationId: string;
          try {
            ({
              data: { id: newOrganizationId, name: nameOrganization },
            } = await Api.postOrganization(organizationFields));

            // Update organizationId field with the new organization id
            fieldsWithOrganisation.organizationId = {
              label: nameOrganization as string,
              value: newOrganizationId,
            };
          } catch (error) {
            console.error(error);
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
      }

      const excludedFieldsKeys = ['nameOrganization', 'acceptCGU'];
      // Compute registration fields to store but exclude organization fields
      let registrationFields = fieldsKeys.reduce((acc, curr) => {
        if (!excludedFieldsKeys.includes(curr)) {
          return {
            ...acc,
            [curr]: fields[curr],
          };
        }
        return acc;
      }, {} as RegistrationFormData);
      if (valuesFromOtherStep) {
        registrationFields = fieldsKeys.reduce((acc, curr) => {
          if (
            !Object.keys(valuesFromOtherStep).includes(curr) &&
            !excludedFieldsKeys.includes(curr)
          ) {
            return {
              ...acc,
              [curr]: fields[curr],
            };
          }
          return acc;
        }, {} as RegistrationFormData);
      }

      // Store registration fields
      dispatch(
        registrationActions.setRegistrationCurrentStepData(registrationFields)
      );

      let role: RegistrableUserRole | null = null;

      // Store is not updated yet, so we need to get the role from the fields
      if (Object.keys(registrationFields).includes('role')) {
        // eslint-disable-next-line dot-notation
        [role] = registrationFields['role'] as RegistrableUserRole[];
      } else if (selectedRole) {
        role = selectedRole;
      }

      if (!isLastRegistrationStep) {
        push(
          {
            pathname: `/inscription/${nextStep}`,
            query: role ? { role } : {},
          },
          undefined,
          {
            shallow: true,
          }
        );
      }
    },
    [
      dispatch,
      isLastRegistrationStep,
      nextStep,
      push,
      valuesFromOtherStep,
      selectedRole,
    ]
  );

  useEffect(() => {
    if (shouldSkipStep) {
      // If the user is not eligible for 360, we assign the Boost program to him
      if (
        stepContent &&
        stepContent.skippedBy &&
        stepContent.skippedBy.notEligibleFor360
      ) {
        if (valuesFromOtherStep) {
          const { department } =
            valuesFromOtherStep as FlattenedRegistrationFormData;
          dispatch(
            registrationActions.setRegistrationCurrentStepData({
              program: [Programs.BOOST],
              department,
            })
          );
        }
      }
      replace(
        {
          pathname: `/inscription/${nextStep}`,
          query: { role: selectedRole },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextStep, replace, shouldSkipStep, dispatch, stepContent, selectedRole]);

  useEffect(() => {
    if (createUserStatus === ReduxRequestEvents.SUCCEEDED && selectedRole) {
      push(
        {
          pathname: `/inscription/${REGISTRATION_CONFIRMATION_STEP}`,
          query: {
            role: selectedRole,
            program: selectedProgram,
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    } else if (createUserStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message:
            createUserError === 'DUPLICATE_EMAIL'
              ? 'Cette adresse email est déjà utilisée'
              : 'Une erreur est survenue',
        })
      );
    }
  }, [
    createUserError,
    createUserStatus,
    dispatch,
    push,
    selectedProgram,
    selectedRole,
  ]);

  const onBack = useCallback(back, [back]);

  useEffect(() => {
    return () => {
      dispatch(registrationActions.createUserReset());
    };
  }, [dispatch]);

  return {
    isRegistrationLoading,
    stepContent,
    stepData,
    defaultValues: valuesFromOtherStep,
    isFirstRegistrationStep,
    isLastRegistrationStep,
    onSubmitStepForm,
    onBack,
  };
}
