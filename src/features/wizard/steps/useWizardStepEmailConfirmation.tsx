import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, LucidIcon } from '@/src/components/ui';
import { RoundBadge } from '@/src/components/ui/Badge/RoundBadge/RoundBadge';
import { H2 } from '@/src/components/ui/Headings';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { authenticationActions } from '@/src/use-cases/authentication';
import { selectRegistrationData } from '@/src/use-cases/registration';
import { EmailOtpInput } from '../components/EmailOtpInput/EmailOtpInput';

const OTP_LENGTH = 6;

export const EMAIL_CONFIRMATION_STEP: WizardStep = {
  id: 'email-confirmation',
  smallTitle: 'Confirmation email',
  title: null,
  description: null,
  summary: {
    title: 'Confirmation email',
    duration: '~1 minute',
  },
  hideGenericStepHeader: undefined,
  content: null,
  section: 'inscription',
};

export const useWizardStepEmailConfirmation = (): WizardStep => {
  const dispatch = useDispatch();
  const registrationData = useSelector(selectRegistrationData) as any;
  const email = registrationData?.email as string | undefined;
  const [code, setCode] = useState('');
  const codeRef = useRef('');

  const handleCodeChange = useCallback((newCode: string) => {
    codeRef.current = newCode;
    setCode(newCode);
  }, []);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (code.length === OTP_LENGTH && email) {
      dispatch(authenticationActions.verifyOtpRequested({ email, code }));
    }
  }, [code, email, dispatch]);

  return useMemo<WizardStep>(
    () => ({
      ...EMAIL_CONFIRMATION_STEP,
      content: (
        <Card>
          <RoundBadge bgColor="primaryBlue" borderColor="primaryBlue" size={56}>
            <LucidIcon name="Mail" color="white" size={28} />
          </RoundBadge>
          <br />
          <H2 title="Vérifiez votre email" />
          <br />
          <EmailOtpInput onCodeChange={handleCodeChange} />
        </Card>
      ),
      onSubmit: async () => {
        const currentCode = codeRef.current;
        if (currentCode.length !== OTP_LENGTH || !email) {
          return false;
        }
        dispatch(
          authenticationActions.verifyOtpRequested({ email, code: currentCode })
        );
      },
    }),
    [handleCodeChange, email, dispatch]
  );
};
