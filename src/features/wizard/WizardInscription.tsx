import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { UserProfileSectorOccupation } from 'src/api/types';
import { Button } from 'src/components/ui';
import { SelectList } from 'src/components/ui/Inputs/SelectList/SelectList';
import { SelectOptionTitleIconDescriptionLabel } from 'src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionTitleIconDescriptionLabel/SelectOptionTitleIconDescriptionLabel';
import { SvgIcon } from 'src/components/ui/SvgIcon/SvgIcon';
import { UserRoles } from 'src/constants/users';
import { RegistrationFlow } from 'src/features/registration/flows/flows.types';
import { useWizardSuggestions } from 'src/hooks/useWizardSuggestions';
import {
  authenticationActions,
  selectAccessToken,
} from 'src/use-cases/authentication';
import { currentUserActions } from 'src/use-cases/current-user';
import {
  selectWizardCreateAccountError,
  selectWizardCurrentSubStep,
  selectWizardData,
  selectWizardIsLoading,
  selectWizardOtpError,
  selectWizardOtpRequestStatus,
  selectWizardOtpVerifyStatus,
  selectWizardPanelState,
  selectWizardSuggestions,
  selectWizardUserId,
  wizardActions,
} from 'src/use-cases/wizard';
import { PanelSuggestions } from './PanelSuggestions';
import { WizardDone } from './WizardDone';
import { WizardLayout } from './WizardLayout';
import { Step11Nudges } from './steps/Step11Nudges';
import { Step12MetiersSecteurs } from './steps/Step12MetiersSecteurs';
import { Step13PersonalInfo } from './steps/Step13PersonalInfo';
import { Step14Account } from './steps/Step14Account';
import { Step15Otp } from './steps/Step15Otp';
import { Step21Elearning } from './steps/Step21Elearning';
import { Step31SocialSituation } from './steps/Step31SocialSituation';

const StyledFlowSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 0;
`;

const StyledFlowActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const FLOW_OPTIONS = [
  {
    value: RegistrationFlow.CANDIDATE,
    label: 'Nous rejoindre en tant que candidat(e)',
    icon: <SvgIcon name="IlluCV" width={50} height={50} />,
    description: "J'ai besoin d'aide dans ma recherche",
    role: UserRoles.CANDIDATE,
  },
  {
    value: RegistrationFlow.COACH,
    label: 'Nous rejoindre en tant que coach',
    icon: <SvgIcon name="IlluCoachEtCandidat" width={50} height={50} />,
    description: 'Je souhaite accompagner des candidats dans leur recherche',
    role: UserRoles.COACH,
  },
  {
    value: RegistrationFlow.REFERER,
    label: "Nous rejoindre en tant qu'association ou travailleur social",
    icon: <SvgIcon name="IlluCandidatFolder" width={50} height={50} />,
    description: 'Je souhaite orienter des candidats de ma structure',
    role: UserRoles.REFERER,
  },
  {
    value: RegistrationFlow.COMPANY,
    label: "Nous rejoindre en tant qu'entreprise",
    icon: <SvgIcon name="IlluPoigneeDeMain" width={50} height={50} />,
    description:
      'Je souhaite inscrire mon entreprise dans une démarche RSE ou de recrutement inclusif',
    role: UserRoles.COACH,
  },
];

export const WizardInscription = () => {
  const dispatch = useDispatch();
  const [selectedFlows, setSelectedFlows] = useState<RegistrationFlow[]>([]);

  const currentSubStep = useSelector(selectWizardCurrentSubStep);
  const wizardData = useSelector(selectWizardData);
  const wizardUserId = useSelector(selectWizardUserId);
  const isLoading = useSelector(selectWizardIsLoading);
  const otpError = useSelector(selectWizardOtpError);
  const otpRequestStatus = useSelector(selectWizardOtpRequestStatus);
  const otpVerifyStatus = useSelector(selectWizardOtpVerifyStatus);
  const panelState = useSelector(selectWizardPanelState);
  const suggestions = useSelector(selectWizardSuggestions);
  const createAccountError = useSelector(selectWizardCreateAccountError);
  const accessToken = useSelector(selectAccessToken);

  const role = wizardData.role as UserRoles | undefined;

  const { triggerLoading } = useWizardSuggestions(wizardUserId);

  // Auto-login after OTP verification (steps 2.x+ require auth)
  useEffect(() => {
    if (
      otpVerifyStatus === 'SUCCEEDED' &&
      !accessToken &&
      wizardData.email &&
      wizardData.password
    ) {
      dispatch(
        authenticationActions.loginRequested({
          email: wizardData.email,
          password: wizardData.password,
        })
      );
    }
  }, [
    otpVerifyStatus,
    accessToken,
    wizardData.email,
    wizardData.password,
    dispatch,
  ]);

  // Save nudges after login succeeds (nudges stored in Redux during step 1.1)
  useEffect(() => {
    if (
      accessToken &&
      wizardUserId &&
      wizardData.nudges &&
      wizardData.nudges.length > 0 &&
      otpVerifyStatus === 'SUCCEEDED'
    ) {
      dispatch(
        currentUserActions.updateProfileRequested({
          userId: wizardUserId,
          userProfile: { nudgeIds: wizardData.nudges } as never,
        })
      );
    }
  }, [accessToken, wizardUserId, wizardData.nudges, otpVerifyStatus, dispatch]);

  // Trigger panel loading when entering elearning step
  useEffect(() => {
    if (currentSubStep === '2.1-elearning') {
      triggerLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubStep]);

  const mergeData = useCallback(
    (data: Parameters<typeof wizardActions.mergeWizardData>[0]) => {
      dispatch(wizardActions.mergeWizardData(data));
    },
    [dispatch]
  );

  const handleConfirmFlow = () => {
    const flowValue = selectedFlows[0];
    if (!flowValue) {
      return;
    }
    const option = FLOW_OPTIONS.find((o) => o.value === flowValue);
    if (!option) {
      return;
    }
    mergeData({ role: option.role, flow: flowValue });
    dispatch(wizardActions.moveToSubStep('1.1-nudges'));
  };

  const handleNudgesNext = (nudgeIds: string[]) => {
    mergeData({ nudges: nudgeIds });
    dispatch(wizardActions.moveToSubStep('1.2-metiers-secteurs'));
  };

  const handleSectorsNext = (
    sectorOccupations: UserProfileSectorOccupation[]
  ) => {
    mergeData({ sectorOccupations });
    dispatch(wizardActions.moveToSubStep('1.3-personal-info'));
  };

  const handlePersonalInfoNext = (values: {
    firstName: string;
    lastName: string;
    gender: string;
    phone: string;
    birthDate?: string;
    department: { value: string; label: string } | null;
    workingRight?: string;
  }) => {
    mergeData({
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender ? (Number(values.gender) as number) : undefined,
      phone: values.phone,
      birthDate: values.birthDate,
      department: values.department ?? undefined,
      workingRight: values.workingRight,
    });
    dispatch(wizardActions.moveToSubStep('1.4-account'));
  };

  const handleAccountNext = (values: {
    email: string;
    password: string;
    optInNewsletter: boolean;
  }) => {
    mergeData({
      email: values.email,
      password: values.password,
      optInNewsletter: values.optInNewsletter,
    });
    dispatch(wizardActions.createAccountRequested());
  };

  const handleVerifyOtp = (code: string) => {
    dispatch(wizardActions.verifyOtpRequested({ code }));
  };

  const handleResendOtp = () => {
    dispatch(wizardActions.sendOtpRequested());
  };

  const handleElearningNext = () => {
    if (role === UserRoles.CANDIDATE) {
      dispatch(wizardActions.moveToSubStep('3.1-social-situation'));
    } else {
      dispatch(wizardActions.moveToSubStep('done'));
    }
  };

  const handleSocialSituationNext = () => {
    dispatch(wizardActions.moveToSubStep('done'));
  };

  const renderStep = () => {
    // No flow selected yet — show flow selection
    if (!role) {
      return (
        <StyledFlowSelection>
          <SelectList
            id="wizard-flow-selection"
            name="flow"
            options={FLOW_OPTIONS.map((opt) => ({
              value: opt.value,
              label: (
                <SelectOptionTitleIconDescriptionLabel
                  title={opt.label}
                  icon={opt.icon}
                  description={opt.description}
                />
              ),
            }))}
            value={selectedFlows}
            onChange={(val) => setSelectedFlows(val as RegistrationFlow[])}
            isMulti={false}
          />
          <StyledFlowActions>
            <Button
              onClick={handleConfirmFlow}
              disabled={selectedFlows.length === 0}
            >
              Suivant
            </Button>
          </StyledFlowActions>
        </StyledFlowSelection>
      );
    }

    switch (currentSubStep) {
      case '1.1-nudges':
        return (
          <Step11Nudges
            role={role}
            initialNudgeIds={wizardData.nudges}
            onNext={handleNudgesNext}
          />
        );

      case '1.2-metiers-secteurs':
        return (
          <Step12MetiersSecteurs
            initialSectorOccupations={wizardData.sectorOccupations}
            onNext={handleSectorsNext}
            onBack={() => dispatch(wizardActions.moveToSubStep('1.1-nudges'))}
          />
        );

      case '1.3-personal-info':
        return (
          <Step13PersonalInfo
            role={role}
            initialValues={{
              firstName: wizardData.firstName,
              lastName: wizardData.lastName,
              phone: wizardData.phone,
              birthDate: wizardData.birthDate,
              department: wizardData.department,
              workingRight: wizardData.workingRight,
            }}
            onNext={handlePersonalInfoNext}
            onBack={() =>
              dispatch(wizardActions.moveToSubStep('1.2-metiers-secteurs'))
            }
          />
        );

      case '1.4-account':
        return (
          <Step14Account
            initialEmail={wizardData.email}
            isLoading={isLoading}
            isConflict={createAccountError === 'conflict'}
            onNext={handleAccountNext}
            onBack={() =>
              dispatch(wizardActions.moveToSubStep('1.3-personal-info'))
            }
          />
        );

      case '1.5-otp':
        return (
          <Step15Otp
            email={wizardData.email ?? ''}
            otpError={otpError}
            isVerifying={otpVerifyStatus === 'REQUESTED'}
            isSending={otpRequestStatus === 'REQUESTED'}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
          />
        );

      case '2.1-elearning':
        return (
          <Step21Elearning
            panelState={panelState}
            onNext={handleElearningNext}
          />
        );

      case '3.1-social-situation':
        return <Step31SocialSituation onNext={handleSocialSituationNext} />;

      case 'done':
        return <WizardDone />;

      default:
        return null;
    }
  };

  return (
    <WizardLayout
      currentSubStep={currentSubStep}
      role={role}
      panelState={panelState}
      suggestions={suggestions}
      panel={
        <PanelSuggestions panelState={panelState} suggestions={suggestions} />
      }
    >
      {renderStep()}
    </WizardLayout>
  );
};
