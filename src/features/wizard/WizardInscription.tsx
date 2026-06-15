import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileSectorOccupation } from 'src/api/types';
import { UserRoles } from 'src/constants/users';
import { authenticationActions, selectAccessToken } from 'src/use-cases/authentication';
import { currentUserActions } from 'src/use-cases/current-user';
import {
  selectWizardCreateAccountError,
  selectWizardCurrentMajorStep,
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
import { useWizardSuggestions } from 'src/hooks/useWizardSuggestions';
import { WizardLayout } from './WizardLayout';
import { PanelSuggestions } from './PanelSuggestions';
import { WizardDone } from './WizardDone';
import { Step11Nudges } from './steps/Step11Nudges';
import { Step12MetiersSecteurs } from './steps/Step12MetiersSecteurs';
import { Step13PersonalInfo } from './steps/Step13PersonalInfo';
import { Step14Account } from './steps/Step14Account';
import { Step15Otp } from './steps/Step15Otp';
import { Step21Elearning } from './steps/Step21Elearning';
import { Step31SocialSituation } from './steps/Step31SocialSituation';
import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import { Button } from 'src/components/ui';

const StyledFlowSelection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 24px;
  text-align: center;
`;

const StyledFlowButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
`;

const StyledFlowButton = styled.button`
  padding: 16px 24px;
  border: 2px solid ${COLORS.gray};
  border-radius: 8px;
  background: ${COLORS.white};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: ${COLORS.primaryBlue};
    background-color: #f0f8fa;
  }
`;

const ROLE_LABELS: Partial<Record<UserRoles, { title: string; description: string }>> = {
  [UserRoles.CANDIDATE]: {
    title: 'Je cherche un emploi',
    description: 'Je suis candidat en recherche d'un accompagnement',
  },
  [UserRoles.COACH]: {
    title: 'Je veux accompagner',
    description: 'Je suis coach / bénévole souhaitant aider',
  },
};

export const WizardInscription = () => {
  const dispatch = useDispatch();

  const currentSubStep = useSelector(selectWizardCurrentSubStep);
  const currentMajorStep = useSelector(selectWizardCurrentMajorStep);
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
  }, [otpVerifyStatus, accessToken, wizardData.email, wizardData.password, dispatch]);

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

  const handleSelectRole = (selectedRole: UserRoles) => {
    mergeData({ role: selectedRole });
    dispatch(wizardActions.moveToSubStep('1.1-nudges'));
  };

  const handleNudgesNext = (nudgeIds: string[]) => {
    mergeData({ nudges: nudgeIds });
    dispatch(wizardActions.moveToSubStep('1.2-metiers-secteurs'));
  };

  const handleSectorsNext = (sectorOccupations: UserProfileSectorOccupation[]) => {
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
    // No role selected yet — show flow selection
    if (!role) {
      return (
        <StyledFlowSelection>
          <h2>Bienvenue sur Entourage Pro</h2>
          <p>Quel est votre profil ?</p>
          <StyledFlowButtons>
            {Object.entries(ROLE_LABELS).map(([roleKey, { title, description }]) => (
              <StyledFlowButton
                key={roleKey}
                onClick={() => handleSelectRole(roleKey as UserRoles)}
              >
                <strong>{title}</strong>
                <br />
                <small style={{ color: '#6D6C6C' }}>{description}</small>
              </StyledFlowButton>
            ))}
          </StyledFlowButtons>
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
      currentMajorStep={currentMajorStep}
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
