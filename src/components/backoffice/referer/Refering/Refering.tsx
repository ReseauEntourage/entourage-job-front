import React from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { Card, Typography } from 'src/components/utils';
import { Spinner } from 'src/components/utils/Spinner';
import {
  StyledReferingContainer,
  StyledReferingSpinnerContainer,
  StyledReferingSubtitle,
  StyledReferingPage,
} from './Refering.styles';
import { useRefering } from './useRefering';

export function Refering() {
  const {
    isReferingLoading,
    stepContent,
    stepData,
    defaultValues,
    isFirstReferingStep,
    onSubmitStepForm,
    onBack,
  } = useRefering();

  return (
    <StyledReferingPage>
      <StyledReferingContainer>
        <EntourageProLogoPrimary width={226} height={78} />
        <Card title="Créer le compte Entourage pro">
          {!isReferingLoading && (
            <>
              {stepContent.subtitle && (
                <StyledReferingSubtitle>
                  <Typography weight="normal">
                    {stepContent.subtitle}
                  </Typography>
                  {stepContent.annotation && (
                    <Typography
                      weight="normal"
                      color="lighter"
                      variant="italic"
                    >
                      {stepContent.annotation}
                    </Typography>
                  )}
                </StyledReferingSubtitle>
              )}
              <FormWithValidation
                formSchema={stepContent.form}
                defaultValues={{
                  ...(stepData || {}),
                  ...(defaultValues || {}),
                }}
                onSubmit={onSubmitStepForm}
                submitText="Suivant"
                cancelText="Précédent"
                {...(!isFirstReferingStep ? { onCancel: onBack } : {})}
              />
            </>
          )}
          {isReferingLoading && (
            <StyledReferingSpinnerContainer>
              <Spinner />
            </StyledReferingSpinnerContainer>
          )}
        </Card>
      </StyledReferingContainer>
    </StyledReferingPage>
  );
}
