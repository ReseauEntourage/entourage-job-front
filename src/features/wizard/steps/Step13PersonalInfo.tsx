import React from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import type { Value as PhoneValue } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import styled from 'styled-components';
import { Button } from 'src/components/ui';
import { H2 } from 'src/components/ui/Headings';
import {
  DatePicker,
  PhoneInput,
  Radio,
  Select,
  TextInput,
} from 'src/components/ui/Inputs';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { GENDERS_FILTERS } from 'src/constants/genders';
import { UserRoles } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';
import {
  StyledOnboardingActions,
  StyledOnboardingStepContainer,
} from 'src/features/backoffice/onboarding/onboarding.styles';

const StyledField = styled.div`
  margin-bottom: 16px;
`;

interface PersonalInfoValues {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  birthDate: string;
  department: { value: string; label: string } | null;
  workingRight?: string;
}

interface Step13PersonalInfoProps {
  role: UserRoles;
  initialValues?: Partial<PersonalInfoValues>;
  onNext: (values: PersonalInfoValues) => void;
  onBack: () => void;
}

export const Step13PersonalInfo = ({
  role,
  initialValues = {},
  onNext,
  onBack,
}: Step13PersonalInfoProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoValues>({
    defaultValues: {
      firstName: initialValues.firstName ?? '',
      lastName: initialValues.lastName ?? '',
      gender: initialValues.gender ?? '',
      phone: initialValues.phone ?? '',
      birthDate: initialValues.birthDate ?? '',
      department: initialValues.department ?? null,
      workingRight: initialValues.workingRight ?? '',
    },
  });

  const isCandidate = role === UserRoles.CANDIDATE;

  const maxBirthDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18)
  )
    .toISOString()
    .split('T')[0];

  const onSubmit = handleSubmit((values) => {
    onNext(values);
  });

  return (
    <StyledOnboardingStepContainer>
      <H2 title="Vos informations personnelles" />
      <form onSubmit={onSubmit}>
        <StyledField>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: 'Prénom obligatoire' }}
            render={({ field }) => (
              <TextInput
                id="firstName"
                name="firstName"
                title="Prénom *"
                value={field.value}
                onChange={field.onChange}
                showLabel
                error={errors.firstName}
              />
            )}
          />
        </StyledField>

        <StyledField>
          <Controller
            control={control}
            name="lastName"
            rules={{ required: 'Nom obligatoire' }}
            render={({ field }) => (
              <TextInput
                id="lastName"
                name="lastName"
                title="Nom *"
                value={field.value}
                onChange={field.onChange}
                showLabel
                error={errors.lastName}
              />
            )}
          />
        </StyledField>

        <StyledField>
          <Controller
            control={control}
            name="gender"
            rules={{ required: 'Genre obligatoire' }}
            render={({ field }) => (
              <Radio
                id="gender"
                name="gender"
                title="Genre *"
                options={GENDERS_FILTERS.map((g) => ({
                  inputId: `gender-${String(g.value)}`,
                  value: String(g.value),
                  label: String(g.label),
                }))}
                value={field.value}
                onChange={field.onChange}
                error={errors.gender}
              />
            )}
          />
        </StyledField>

        <StyledField>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Téléphone obligatoire',
              validate: (v) =>
                isValidPhoneNumber(v || '', 'FR') ||
                'Numéro de téléphone invalide',
            }}
            render={({ field }) => (
              <PhoneInput
                id="phone"
                name="phone"
                title="Téléphone *"
                value={field.value as unknown as PhoneValue}
                onChange={(v) => field.onChange(v ?? '')}
                showLabel
                error={errors.phone}
              />
            )}
          />
        </StyledField>

        {isCandidate && (
          <>
            <StyledField>
              <Controller
                control={control}
                name="birthDate"
                rules={{
                  required: 'Date de naissance obligatoire',
                  validate: (v) =>
                    new Date(v) <= new Date(maxBirthDate) ||
                    'Vous devez avoir au moins 18 ans',
                }}
                render={({ field }) => (
                  <DatePicker
                    id="birthDate"
                    name="birthDate"
                    title="Date de naissance *"
                    value={field.value}
                    onChange={field.onChange}
                    max={maxBirthDate}
                    error={errors.birthDate}
                  />
                )}
              />
            </StyledField>

            <StyledField>
              <Controller
                control={control}
                name="department"
                rules={{ required: 'Département obligatoire' }}
                render={({ field }) => (
                  <Select
                    id="department-candidate"
                    name="department"
                    title="Dans quel département habitez-vous ? *"
                    options={DEPARTMENTS_FILTERS}
                    value={field.value as FilterConstant}
                    onChange={(v) =>
                      field.onChange(v as PersonalInfoValues['department'])
                    }
                    showLabel
                    error={errors.department as FieldError | undefined}
                  />
                )}
              />
            </StyledField>

            <StyledField>
              <Controller
                control={control}
                name="workingRight"
                render={({ field }) => (
                  <Radio
                    id="workingRight"
                    name="workingRight"
                    title="Avez-vous le droit de travailler en France ? *"
                    options={[
                      {
                        inputId: 'workingRight-yes',
                        value: 'yes',
                        label: 'Oui',
                      },
                      { inputId: 'workingRight-no', value: 'no', label: 'Non' },
                      {
                        inputId: 'workingRight-nspp',
                        value: 'nspp',
                        label: 'Ne sait pas',
                      },
                    ]}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                  />
                )}
              />
            </StyledField>
          </>
        )}

        {!isCandidate && (
          <StyledField>
            <Controller
              control={control}
              name="department"
              rules={{ required: 'Département obligatoire' }}
              render={({ field }) => (
                <Select
                  id="department-other"
                  name="department"
                  title="Dans quel département habitez-vous ? *"
                  options={DEPARTMENTS_FILTERS}
                  value={field.value as FilterConstant}
                  onChange={(v) =>
                    field.onChange(v as PersonalInfoValues['department'])
                  }
                  showLabel
                  error={errors.department as FieldError | undefined}
                />
              )}
            />
          </StyledField>
        )}

        <StyledOnboardingActions>
          <Button onClick={onBack} size="large" variant="secondary">
            Retour
          </Button>
          <Button onClick={() => onSubmit()} size="large">
            Étape suivante
          </Button>
        </StyledOnboardingActions>
      </form>
    </StyledOnboardingStepContainer>
  );
};
