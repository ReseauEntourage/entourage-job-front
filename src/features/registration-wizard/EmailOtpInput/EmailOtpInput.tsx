import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import { authenticationActions } from '@/src/use-cases/authentication';
import { VerifyOtpErrorType } from '@/src/use-cases/authentication/authentication.adapters';
import {
  sendVerifyEmailSelectors,
  verifyOtpSelectors,
  selectVerifyOtpError,
} from '@/src/use-cases/authentication/authentication.selectors';
import { selectRegistrationData } from '@/src/use-cases/registration';

interface EmailOtpInputProps {
  onCodeChange: (code: string) => void;
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 420px;
`;

const StyledHint = styled.p`
  font-family: Poppins, sans-serif;
  font-size: 15px;
  color: ${COLORS.darkGray};
  line-height: 1.6;
  margin: 0;
`;

const StyledDigitsRow = styled.div`
  display: flex;
  gap: 10px;
`;

const StyledDigitBox = styled.input<{ hasError: boolean }>`
  width: 48px;
  height: 56px;
  border: 2px solid
    ${({ hasError }) => (hasError ? COLORS.lightRed : COLORS.primaryBlue)};
  border-radius: 8px;
  text-align: center;
  font-family: Poppins, sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: ${COLORS.darkGray};
  outline: none;
  background: ${COLORS.white};

  &:focus {
    border-color: ${({ hasError }) =>
      hasError ? COLORS.lightRed : COLORS.primaryBlue};
    box-shadow: 0 0 0 3px
      ${({ hasError }) =>
        hasError ? `${COLORS.lightRed}33` : `${COLORS.primaryBlue}33`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledError = styled.p`
  font-family: Poppins, sans-serif;
  font-size: 13px;
  color: ${COLORS.lightRed};
  margin: 0;
`;

const StyledResendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: Poppins, sans-serif;
  font-size: 14px;
  color: ${COLORS.darkGray};
`;

const StyledResendButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-family: Poppins, sans-serif;
  font-size: 14px;
  color: ${COLORS.primaryBlue};
  cursor: pointer;
  text-decoration: underline;

  &:disabled {
    color: ${COLORS.darkGray};
    cursor: not-allowed;
    text-decoration: none;
  }
`;

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) {
    return email;
  }
  const masked =
    local.length <= 2
      ? local[0] + '***'
      : local[0] + '***' + local[local.length - 1];
  return `${masked}@${domain}`;
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
      <StyledHint>
        Nous avons envoyé un code à 6 chiffres à{' '}
        <strong>{email ? maskEmail(email) : 'votre adresse email'}</strong>.
        Saisissez-le ci-dessous pour confirmer votre compte.
      </StyledHint>

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
        <StyledError>
          {otpError === VerifyOtpErrorType.EXPIRED
            ? 'Ce code a expiré. Veuillez en demander un nouveau.'
            : 'Code invalide. Vérifiez et réessayez.'}
        </StyledError>
      )}

      <StyledResendRow>
        <span>Vous n'avez pas reçu de code ?</span>
        <StyledResendButton
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || isSending}
        >
          {cooldown > 0 ? `Renvoyer (${cooldown}s)` : 'Renvoyer le code'}
        </StyledResendButton>
      </StyledResendRow>

      <StyledHint>
        Vous pouvez aussi cliquer sur le lien dans l'email pour confirmer votre
        compte.
      </StyledHint>
    </StyledContainer>
  );
}
