import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'src/components/ui';
import { PasswordStrengthIndicator } from 'src/components/ui/PasswordStrengthIndicator';
import { passwordStrength } from 'check-password-strength';
import { isEmail } from 'validator';
import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

const StyledField = styled.div`
  margin-bottom: 16px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: ${COLORS.black};
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${({ hasError }) => (hasError ? COLORS.orangeSocial : COLORS.gray)};
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${COLORS.primaryBlue};
  }
`;

const StyledError = styled.span`
  font-size: 12px;
  color: ${COLORS.orangeSocial};
  margin-top: 4px;
  display: block;
`;

const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
  line-height: 1.4;
`;

const StyledConflictError = styled.p`
  color: ${COLORS.orangeSocial};
  font-size: 14px;
  font-weight: 500;
`;

interface AccountValues {
  email: string;
  password: string;
  confirmPassword: string;
  acceptCGU: boolean;
  optInNewsletter: boolean;
}

interface Step14AccountProps {
  initialEmail?: string;
  isLoading?: boolean;
  isConflict?: boolean;
  onNext: (values: { email: string; password: string; optInNewsletter: boolean }) => void;
  onBack: () => void;
}

export const Step14Account = ({
  initialEmail = '',
  isLoading = false,
  isConflict = false,
  onNext,
  onBack,
}: Step14AccountProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountValues>({
    defaultValues: {
      email: initialEmail,
      password: '',
      confirmPassword: '',
      acceptCGU: false,
      optInNewsletter: false,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit((values) => {
    onNext({
      email: values.email,
      password: values.password,
      optInNewsletter: values.optInNewsletter,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <h2>Créez votre compte</h2>

      {isConflict && (
        <StyledConflictError>
          Un compte existe déjà avec cette adresse e-mail.{' '}
          <a href="/connexion">Se connecter</a>
        </StyledConflictError>
      )}

      <StyledField>
        <StyledLabel htmlFor="email">Adresse e-mail *</StyledLabel>
        <StyledInput
          id="email"
          type="email"
          hasError={!!errors.email}
          {...register('email', {
            required: 'E-mail obligatoire',
            validate: (v) => isEmail(v) || 'Adresse e-mail invalide',
          })}
        />
        {errors.email && <StyledError>{errors.email.message}</StyledError>}
      </StyledField>

      <StyledField>
        <StyledLabel htmlFor="password">Mot de passe *</StyledLabel>
        <StyledInput
          id="password"
          type="password"
          hasError={!!errors.password}
          {...register('password', {
            required: 'Mot de passe obligatoire',
            validate: (v) =>
              passwordStrength(v).id >= 2 ||
              'Mot de passe trop faible (utilisez majuscules, chiffres et caractères spéciaux)',
          })}
        />
        <PasswordStrengthIndicator password={passwordValue} />
        {errors.password && (
          <StyledError>{errors.password.message}</StyledError>
        )}
      </StyledField>

      <StyledField>
        <StyledLabel htmlFor="confirmPassword">
          Confirmer le mot de passe *
        </StyledLabel>
        <StyledInput
          id="confirmPassword"
          type="password"
          hasError={!!errors.confirmPassword}
          {...register('confirmPassword', {
            required: 'Confirmation obligatoire',
            validate: (v) =>
              v === passwordValue || 'Les mots de passe ne correspondent pas',
          })}
        />
        {errors.confirmPassword && (
          <StyledError>{errors.confirmPassword.message}</StyledError>
        )}
      </StyledField>

      <StyledField>
        <StyledCheckboxLabel>
          <input type="checkbox" {...register('acceptCGU', { required: true })} />
          J'accepte les{' '}
          <a href="/conditions-generales" target="_blank" rel="noreferrer">
            conditions générales d'utilisation
          </a>
          *
        </StyledCheckboxLabel>
        {errors.acceptCGU && (
          <StyledError>Vous devez accepter les CGU</StyledError>
        )}
      </StyledField>

      <StyledField>
        <StyledCheckboxLabel>
          <input type="checkbox" {...register('optInNewsletter')} />
          Je souhaite recevoir les actualités et offres d'Entourage Pro
        </StyledCheckboxLabel>
      </StyledField>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button onClick={onBack} variant="secondary" disabled={isLoading}>
          Retour
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Création en cours…' : 'Créer mon compte'}
        </Button>
      </div>
    </form>
  );
};
