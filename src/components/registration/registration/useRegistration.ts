import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GA_TAGS_FACTORY } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { RegistrationFlow } from '../flows/flows.types';
import { CREATE_NEW_COMPANY_VALUE } from '../forms/formRegistrationCompanySelection';
import { CREATE_NEW_ORGANIZATION_VALUE } from '../forms/formRegistrationRefererAccount';
import {
  REGISTRATION_CONFIRMATION_STEP,
  REGISTRATION_FIRST_STEP,
  RegistrationExcludedFieldsKeys,
} from '../registration.config';
import {
  RegistrationFlowFormWithCompanyField,
  RegistrationFlowFormWithOrganizationField,
  RegistrationFormData,
} from '../registration.types';
import { Api } from 'src/api';
import { CompanyDto, OrganizationDto } from 'src/api/types';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { ReduxRequestEvents } from 'src/constants';
import { DEPARTMENTS } from 'src/constants/departements';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  createUserSelectors,
  registrationActions,
  selectCreateUserError,
  selectIsFirstRegistrationStep,
  selectIsRegistrationLoading,
  selectRegistrationCurrentStep,
  selectRegistrationCurrentStepContent,
  selectRegistrationNextStep,
  selectRegistrationSelectedFlow,
  selectRegistrationShouldSkipStep,
  selectNextIsLastRegistrationStep,
  selectRegistrationData,
} from 'src/use-cases/registration';

export function useRegistration() {
  const { push } = useRouter();
  const dispatch = useDispatch();

  // Retrieve optionnal query parameters from the URL "companyId"
  const router = useRouter();
  const { query } = router;
  const defaultCompanyId = query.companyId
    ? (query.companyId as string)
    : undefined;
  const defaultFlow = query.flow ? (query.flow as RegistrationFlow) : undefined;

  const isRegistrationLoading = useSelector(selectIsRegistrationLoading);

  const currentStep = useSelector(selectRegistrationCurrentStep);
  const stepContent = useSelector(selectRegistrationCurrentStepContent);
  const data = useSelector(selectRegistrationData);
  const isFirstRegistrationStep = useSelector(selectIsFirstRegistrationStep);
  const nextIsLastRegistrationStep = useSelector(
    selectNextIsLastRegistrationStep
  );
  const nextStep = useSelector(selectRegistrationNextStep);
  const shouldSkipStep = useSelector(selectRegistrationShouldSkipStep);

  const selectedFlow = useSelector(selectRegistrationSelectedFlow);

  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );
  const createUserError = useSelector(selectCreateUserError);

  const handleOrganizationFields = useCallback(
    async (fields: RegistrationFormData) => {
      const fieldsWithOrganisation =
        fields as ExtractFormSchemaValidation<RegistrationFlowFormWithOrganizationField>;
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
        }
      }
    },
    [dispatch]
  );

  const handleCompanyFields = useCallback(
    async (fields: RegistrationFormData) => {
      const fieldsWithCompany =
        fields as ExtractFormSchemaValidation<RegistrationFlowFormWithCompanyField>;
      const shouldTryToCreateCompany =
        fieldsWithCompany.companyId.value === CREATE_NEW_COMPANY_VALUE;

      // Create company if needed
      if (shouldTryToCreateCompany) {
        let { companyName } = fieldsWithCompany;
        const companyFields = {
          name: companyName,
        } as CompanyDto;

        let newCompanyId: string;
        try {
          ({
            data: { id: newCompanyId, name: companyName },
          } = await Api.postCompany(companyFields));

          // Update companyId field with the new company id
          fieldsWithCompany.companyId = {
            label: companyName as string,
            value: newCompanyId,
          };
        } catch (error) {
          console.error(error);
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur s'est produite lors de la création de l'entreprise",
            })
          );
        }
      }
    },
    [dispatch]
  );

  const handleRegistrationDispatcher = useCallback(
    (fields: RegistrationFormData) => {
      // Compute the flow
      let flow: RegistrationFlow | null = null;
      if (selectedFlow) {
        flow = selectedFlow;
      } else if (Object.keys(fields).includes('flow')) {
        // eslint-disable-next-line dot-notation
        [flow] = fields['flow'];
      }

      // By default the new step is the next step
      let newStep = nextStep;

      // Call the custom submit handler if defined in the step content
      // Should be called before the moveForwardInRegistration action but with the new registrationFields
      if (stepContent?.customDispatch) {
        const middlewareDispatchData = stepContent.customDispatch(fields);
        if (middlewareDispatchData?.flow) {
          // If the flow is defined in the middleware, we use it
          flow = middlewareDispatchData.flow;
        }
        if (middlewareDispatchData?.nextStep !== undefined) {
          // If the next step is defined in the middleware, we use it
          newStep = middlewareDispatchData.nextStep;
        }
      }

      return {
        flow,
        newStep,
      };
    },
    [nextStep, selectedFlow, stepContent]
  );

  const onSubmitStepForm = useCallback(
    async (fields: RegistrationFormData) => {
      const fieldsKeys = Object.keys(fields);

      // Handle organizationId field
      if (fieldsKeys.includes('organizationId')) {
        await handleOrganizationFields(fields);
      }

      // Handle companyId field
      if (fieldsKeys.includes('companyId')) {
        await handleCompanyFields(fields);
      }

      // Compute registration fields to store but exclude non-registration fields
      // like organizationId, nameOrganization, acceptCGU, flow
      let registrationFields = fieldsKeys.reduce((acc, curr) => {
        if (!RegistrationExcludedFieldsKeys.includes(curr)) {
          return {
            ...acc,
            [curr]: fields[curr],
          };
        }
        return acc;
      }, {} as RegistrationFormData);

      // If there are values from a previous step, we merge them with the current step fields
      if (data) {
        registrationFields = fieldsKeys.reduce((acc, curr) => {
          if (
            !Object.keys(data).includes(curr) &&
            !RegistrationExcludedFieldsKeys.includes(curr)
          ) {
            return {
              ...acc,
              [curr]: fields[curr],
            };
          }
          return acc;
        }, {} as RegistrationFormData);
      }

      // Determine the flow and next step to dispatch
      const { flow, newStep } = handleRegistrationDispatcher(fields);

      // Send a GA event for the new step
      if (flow && newStep) {
        gaEvent(GA_TAGS_FACTORY.SIGN_UP_NEW_STEP(flow, newStep));
      }

      // If it's the last step, we dispatch the create user action
      if (nextIsLastRegistrationStep) {
        dispatch(registrationActions.setRegistrationIsEnded(true));
        dispatch(
          registrationActions.moveForwardInRegistration({
            data: registrationFields,
          })
        );
        dispatch(registrationActions.createUserRequested());
      } else {
        // Otherwise, we just move to the next step
        dispatch(
          registrationActions.moveForwardInRegistration({
            data: registrationFields,
            step: newStep,
            flow,
          })
        );
      }
    },
    [
      data,
      handleRegistrationDispatcher,
      nextIsLastRegistrationStep,
      handleOrganizationFields,
      handleCompanyFields,
      dispatch,
    ]
  );

  useEffect(() => {
    if (shouldSkipStep) {
      dispatch(
        registrationActions.moveForwardInRegistration({
          step: nextStep,
        })
      );
    }
  }, [nextStep, shouldSkipStep, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    if (createUserStatus === ReduxRequestEvents.SUCCEEDED && selectedFlow) {
      push(
        {
          pathname: `/inscription/${REGISTRATION_CONFIRMATION_STEP}`,
          query: {
            flow: selectedFlow,
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
  }, [createUserError, createUserStatus, dispatch, push, selectedFlow]);

  const onBack = useCallback(() => {
    if (currentStep === REGISTRATION_FIRST_STEP) {
      dispatch(registrationActions.resetRegistrationData());
    } else {
      dispatch(
        registrationActions.moveForwardInRegistration({
          step: currentStep - 1,
        })
      );
    }
  }, [currentStep, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(registrationActions.createUserReset());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      registrationActions.setDataFromQueryParams({
        companyId: defaultCompanyId,
        flow: defaultFlow,
      })
    );
  }, [defaultCompanyId, defaultFlow, dispatch]);

  return {
    isRegistrationLoading,
    stepContent,
    selectedFlow,
    data,
    isFirstRegistrationStep,
    nextIsLastRegistrationStep,
    onSubmitStepForm,
    onBack,
  };
}
