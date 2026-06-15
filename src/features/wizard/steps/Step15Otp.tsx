import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert, Button } from 'src/components/ui';
import { AlertType } from 'src/components/ui/Alert/Alert.types';
import { H2 } from 'src/components/ui/Headings';
import { OtpInput } from 'src/components/ui/OtpInput';
import { COLORS } from 'src/constants/styles';
import { OtpError } from 'src/use-cases/wizard/wizard.types';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
`;

const StyledEmailHint = styled.p`
  font-size: 14px;
  color: ${COLORS.darkGray};
`;

const StyledEmailBold = styled.span`
  font-weight: bold;
`;

const StyledActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const StyledResend = styled.button`
  background: none;
  border: none;
  color: ${COLORS.primaryBlue};
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;

  &:disabled {
    color: ${COLORS.mediumGray};
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const OTP_ERROR_MESSAGES: Record<OtpError, string> = {
  INVALID_CODE: 'Code incorrect. Veuillez réessayer.',
  EXPIRED: 'Ce code a expiré. Demandez un nouveau code.',
  MAX_ATTEMPTS: 'Trop de tentatives. Demandez un nouveau code pour continuer.',
};

interface Step15OtpProps {
  email: string;
  otpError: OtpError | null;
  isVerifying: boolean;
  isSending: boolean;
  onVerify: (code: string) => void;
  onResend: () => void;
}

export const Step15Otp = ({
  email,
  otpError,
  isVerifying,
  isSending,
  onVerify,
  onResend,
}: Step15OtpProps) => {
  const [code, setCode] = useState('');

  const isBlocked = otpError === 'MAX_ATTEMPTS';
  const isExpired = otpError === 'EXPIRED';

  const handleVerify = () => {
    if (code.length === 6 && !isBlocked) {
      onVerify(code);
    }
  };

  return (
    <StyledContainer>
      <H2 title="Vérifiez votre adresse e-mail" />
      <StyledEmailHint>
        Nous avons envoyé un code à 6 chiffres à{' '}
        <StyledEmailBold>{email}</StyledEmailBold>. Entrez-le ci-dessous pour
        confirmer votre adresse.
      </StyledEmailHint>

      {otpError && (
        <Alert type={AlertType.Error}>{OTP_ERROR_MESSAGES[otpError]}</Alert>
      )}

      <OtpInput
        value={code}
        onChange={setCode}
        hasError={!!otpError && otpError !== 'EXPIRED'}
        disabled={isBlocked || isVerifying}
      />

      <StyledActions>
        <Button
          onClick={handleVerify}
          disabled={code.length < 6 || isBlocked || isVerifying}
        >
          {isVerifying ? 'Vérification…' : 'Valider le code'}
        </Button>

        <StyledResend onClick={onResend} disabled={isSending || isVerifying}>
          {isSending
            ? 'Envoi en cours…'
            : isExpired || isBlocked
            ? 'Renvoyer un nouveau code'
            : "Je n'ai pas reçu le code"}
        </StyledResend>
      </StyledActions>
    </StyledContainer>
  );
};
