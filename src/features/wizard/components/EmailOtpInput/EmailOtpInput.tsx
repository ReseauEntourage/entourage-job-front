import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text } from '@/src/components/ui';
import { authenticationActions } from '@/src/use-cases/authentication';
import { VerifyOtpErrorType } from '@/src/use-cases/authentication/authentication.adapters';
import {
  sendVerifyEmailSelectors,
  verifyOtpSelectors,
  selectVerifyOtpError,
} from '@/src/use-cases/authentication/authentication.selectors';
import { selectRegistrationData } from '@/src/use-cases/registration';
import {
  StyledContainer,
  StyledDigitBox,
  StyledDigitsRow,
  StyledResendRow,
} from './EmailOtpInput.styles';

interface EmailOtpInputProps {
  onCodeChange: (code: string) => void;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export function EmailOtpInput({ onCodeChange }: EmailOtpInputProps) {
  const dispatch = useDispatch();
  const registrationData = useSelector(selectRegistrationData) as any;
  const email = registrationData?.email as string | undefined;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isVerifying = useSelector(
    verifyOtpSelectors.selectIsVerifyOtpRequested
  );
  const isSending = useSelector(
    sendVerifyEmailSelectors.selectIsSendVerifyEmailRequested
  );
  const otpError = useSelector(selectVerifyOtpError);

  const hasError = otpError !== null;
  const code = digits.join('');

  // Notify parent of code changes
  useEffect(() => {
    onCodeChange(code);
  }, [code, onCodeChange]);

  // Reset digits on error so the user can retry
  useEffect(() => {
    if (otpError !== null) {
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  }, [otpError]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleDigitChange = useCallback((idx: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (!pasted) {
      return;
    }
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }, []);

  const handleResend = useCallback(() => {
    if (!email) {
      return;
    }
    dispatch(authenticationActions.sendVerifyEmailRequested({ email }));
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  }, [email, dispatch]);

  const isDisabled = isVerifying || isSending;

  return (
    <StyledContainer>
      <Text color="mediumGray">Nous avons envoyé un code à 6 chiffres à </Text>
      <Text weight="semibold">{email ? email : 'votre adresse email'}.</Text>
      <Text color="mediumGray">
        Saisissez-le ci-dessous pour confirmer votre compte.
      </Text>

      <StyledDigitsRow onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <StyledDigitBox
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            disabled={isDisabled}
            hasError={hasError}
            autoFocus={idx === 0}
            aria-label={`Chiffre ${idx + 1}`}
          />
        ))}
      </StyledDigitsRow>

      {hasError && (
        <Text color="lightRed">
          {otpError === VerifyOtpErrorType.EXPIRED
            ? 'Ce code a expiré. Demandez un nouveau code pour continuer.'
            : "Ce code n'est pas valide. Vérifiez les 6 chiffres, ou demandez un nouveau code."}
        </Text>
      )}

      <StyledResendRow>
        <Text color="mediumGray">Vous n'avez pas reçu de code ?</Text>
        <Button
          onClick={handleResend}
          disabled={cooldown > 0 || isSending}
          variant="text"
          color="primaryBlue"
        >
          {cooldown > 0 ? `Renvoyer (${cooldown}s)` : 'Renvoyer le code'}
        </Button>
      </StyledResendRow>

      <Text color="mediumGray">
        Vous pouvez aussi cliquer sur le lien dans l'email pour confirmer votre
        compte.
      </Text>
    </StyledContainer>
  );
}
