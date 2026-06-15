import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'src/components/ui';
import { Alert } from 'src/components/ui';
import { AlertType } from 'src/components/ui/Alert/Alert.types';
import { GENDERS_FILTERS } from 'src/constants/genders';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { UserRoles } from 'src/constants/users';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import Select from 'react-select';

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

const StyledRadioGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const StyledRadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
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
    register,
    handleSubmit,
    setValue,
    watch,
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

  const genderValue = watch('gender');
  const workingRight = watch('workingRight');
  const department = watch('department');

  const isCandidate = role === UserRoles.CANDIDATE;

  const onSubmit = handleSubmit((values) => {
    onNext(values);
  });

  return (
    <form onSubmit={onSubmit}>
      <h2>Vos informations personnelles</h2>

      <StyledField>
        <StyledLabel htmlFor="firstName">Prénom *</StyledLabel>
        <StyledInput
          id="firstName"
          hasError={!!errors.firstName}
          {...register('firstName', { required: 'Prénom obligatoire' })}
        />
        {errors.firstName && (
          <StyledError>{errors.firstName.message}</StyledError>
        )}
      </StyledField>

      <StyledField>
        <StyledLabel htmlFor="lastName">Nom *</StyledLabel>
        <StyledInput
          id="lastName"
          hasError={!!errors.lastName}
          {...register('lastName', { required: 'Nom obligatoire' })}
        />
        {errors.lastName && (
          <StyledError>{errors.lastName.message}</StyledError>
        )}
      </StyledField>

      <StyledField>
        <StyledLabel>Genre *</StyledLabel>
        <StyledRadioGroup>
          {GENDERS_FILTERS.map((g) => (
            <StyledRadioLabel key={String(g.value)}>
              <input
                type="radio"
                value={String(g.value)}
                checked={genderValue === String(g.value)}
                onChange={() => setValue('gender', String(g.value))}
              />
              {g.label}
            </StyledRadioLabel>
          ))}
        </StyledRadioGroup>
        {errors.gender && <StyledError>{errors.gender.message}</StyledError>}
      </StyledField>

      <StyledField>
        <StyledLabel htmlFor="phone">Téléphone *</StyledLabel>
        <StyledInput
          id="phone"
          type="tel"
          hasError={!!errors.phone}
          {...register('phone', {
            required: 'Téléphone obligatoire',
            validate: (v) =>
              isValidPhoneNumber(v, 'FR') || 'Numéro de téléphone invalide',
          })}
        />
        {errors.phone && <StyledError>{errors.phone.message}</StyledError>}
      </StyledField>

      {isCandidate && (
        <>
          <StyledField>
            <StyledLabel htmlFor="birthDate">Date de naissance *</StyledLabel>
            <StyledInput
              id="birthDate"
              type="date"
              hasError={!!errors.birthDate}
              {...register('birthDate', {
                required: 'Date de naissance obligatoire',
                validate: (v) => {
                  const minDate = new Date();
                  minDate.setFullYear(minDate.getFullYear() - 18);
                  return (
                    new Date(v) <= minDate ||
                    'Vous devez avoir au moins 18 ans'
                  );
                },
              })}
            />
            {errors.birthDate && (
              <StyledError>{errors.birthDate.message}</StyledError>
            )}
          </StyledField>

          <StyledField>
            <StyledLabel>Dans quel département habitez-vous ? *</StyledLabel>
            <Select
              placeholder="Sélectionnez votre département"
              options={DEPARTMENTS_FILTERS}
              value={department}
              onChange={(v) =>
                setValue('department', v as PersonalInfoValues['department'])
              }
            />
            {errors.department && (
              <StyledError>Département obligatoire</StyledError>
            )}
          </StyledField>

          <StyledField>
            <StyledLabel>Avez-vous le droit de travailler en France ? *</StyledLabel>
            <StyledRadioGroup>
              {[
                { value: 'yes', label: 'Oui' },
                { value: 'no', label: 'Non' },
                { value: 'nspp', label: 'Ne sait pas' },
              ].map((opt) => (
                <StyledRadioLabel key={opt.value}>
                  <input
                    type="radio"
                    value={opt.value}
                    checked={workingRight === opt.value}
                    onChange={() => setValue('workingRight', opt.value)}
                  />
                  {opt.label}
                </StyledRadioLabel>
              ))}
            </StyledRadioGroup>
          </StyledField>
        </>
      )}

      {!isCandidate && (
        <StyledField>
          <StyledLabel>Dans quel département habitez-vous ? *</StyledLabel>
          <Select
            placeholder="Sélectionnez votre département"
            options={DEPARTMENTS_FILTERS}
            value={department}
            onChange={(v) =>
              setValue('department', v as PersonalInfoValues['department'])
            }
          />
          {errors.department && (
            <StyledError>Département obligatoire</StyledError>
          )}
        </StyledField>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button onClick={onBack} variant="secondary">
          Retour
        </Button>
        <Button type="submit">Continuer</Button>
      </div>
    </form>
  );
};
