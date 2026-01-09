import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Card, Text } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { FormWithValidation } from 'src/features/forms/FormWithValidation';
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
        <SvgIcon name="EntourageProLogoPrimary" width={226} height={78} />
        <Card title="Créer le compte Entourage Pro">
          {!isReferingLoading && (
            <>
              {stepContent.subtitle && (
                <StyledReferingSubtitle>
                  <Text weight="normal">{stepContent.subtitle}</Text>
                  {stepContent.annotation && (
                    <Text weight="normal" color="mediumGray" variant="italic">
                      {stepContent.annotation}
                    </Text>
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
