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
  const submittedCodeRef = useRef<string | null>(null);

  const handleCodeChange = useCallback((newCode: string) => {
    codeRef.current = newCode;
    setCode(newCode);
  }, []);

  const submitCode = useCallback(
    (codeToSubmit: string) => {
      if (codeToSubmit.length !== OTP_LENGTH || !email) {
        return false;
      }
      // Avoid dispatching the same code twice (auto-submit + manual "Valider" click)
      if (submittedCodeRef.current === codeToSubmit) {
        return true;
      }
      submittedCodeRef.current = codeToSubmit;
      dispatch(
        authenticationActions.verifyOtpRequested({ email, code: codeToSubmit })
      );
      return true;
    },
    [dispatch, email]
  );

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    submitCode(code);
  }, [code, submitCode]);

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
        if (!submitCode(codeRef.current)) {
          return false;
        }
      },
    }),
    [handleCodeChange, submitCode]
  );
};
