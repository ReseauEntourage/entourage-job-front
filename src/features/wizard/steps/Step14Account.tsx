import { passwordStrength } from 'check-password-strength';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { isEmail } from 'validator';
import { Alert, Button } from 'src/components/ui';
import { AlertType } from 'src/components/ui/Alert/Alert.types';
import { H2 } from 'src/components/ui/Headings';
import { CheckBox, TextInput } from 'src/components/ui/Inputs';
import { PasswordStrengthIndicator } from 'src/components/ui/PasswordStrengthIndicator';
import {
  StyledOnboardingActions,
  StyledOnboardingStepContainer,
} from 'src/features/backoffice/onboarding/onboarding.styles';

const StyledField = styled.div`
  margin-bottom: 16px;
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
  onNext: (values: {
    email: string;
    password: string;
    optInNewsletter: boolean;
  }) => void;
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
    control,
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
    <StyledOnboardingStepContainer>
      <H2 title="Créez votre compte" />
      <form onSubmit={onSubmit}>
        {isConflict && (
          <Alert type={AlertType.Error}>
            Un compte existe déjà avec cette adresse e-mail.{' '}
            <a href="/connexion">Se connecter</a>
          </Alert>
        )}

        <StyledField>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'E-mail obligatoire',
              validate: (v) => isEmail(v) || 'Adresse e-mail invalide',
            }}
            render={({ field }) => (
              <TextInput
                id="email"
                name="email"
                title="Adresse e-mail *"
                type="email"
                value={field.value}
                onChange={field.onChange}
                showLabel
                error={errors.email}
              />
            )}
          />
        </StyledField>

        <StyledField>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Mot de passe obligatoire',
              validate: (v) =>
                passwordStrength(v).id >= 2 ||
                'Mot de passe trop faible (utilisez majuscules, chiffres et caractères spéciaux)',
            }}
            render={({ field }) => (
              <TextInput
                id="password"
                name="password"
                title="Mot de passe *"
                type="password"
                value={field.value}
                onChange={field.onChange}
                showLabel
                error={errors.password}
              />
            )}
          />
          <PasswordStrengthIndicator password={passwordValue} />
        </StyledField>

        <StyledField>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirmation obligatoire',
              validate: (v) =>
                v === passwordValue || 'Les mots de passe ne correspondent pas',
            }}
            render={({ field }) => (
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                title="Confirmer le mot de passe *"
                type="password"
                value={field.value}
                onChange={field.onChange}
                showLabel
                error={errors.confirmPassword}
              />
            )}
          />
        </StyledField>

        <StyledField>
          <Controller
            control={control}
            name="acceptCGU"
            rules={{ required: 'Vous devez accepter les CGU' }}
            render={({ field }) => (
              <CheckBox
                id="acceptCGU"
                name="acceptCGU"
                title={
                  <>
                    J'accepte les{' '}
                    <a
                      href="/conditions-generales"
                      target="_blank"
                      rel="noreferrer"
                    >
                      conditions générales d'utilisation
                    </a>{' '}
                    *
                  </>
                }
                value={field.value}
                onChange={field.onChange}
                error={errors.acceptCGU}
              />
            )}
          />
        </StyledField>

        <StyledField>
          <Controller
            control={control}
            name="optInNewsletter"
            render={({ field }) => (
              <CheckBox
                id="optInNewsletter"
                name="optInNewsletter"
                title="Je souhaite recevoir les actualités et offres d'Entourage Pro"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </StyledField>

        <StyledOnboardingActions>
          <Button
            onClick={onBack}
            size="large"
            variant="secondary"
            disabled={isLoading}
          >
            Retour
          </Button>
          <Button onClick={() => onSubmit()} size="large" disabled={isLoading}>
            {isLoading ? 'Création en cours…' : 'Créer mon compte'}
          </Button>
        </StyledOnboardingActions>
      </form>
    </StyledOnboardingStepContainer>
  );
};
