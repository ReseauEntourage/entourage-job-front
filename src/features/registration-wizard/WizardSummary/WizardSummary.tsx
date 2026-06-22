import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Text } from '@/src/components/ui';
import { H4 } from '@/src/components/ui/Headings';
import { SelectList } from '@/src/components/ui/Inputs/SelectList';
import { SelectOptionTitleIconDescriptionLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionTitleIconDescriptionLabel/SelectOptionTitleIconDescriptionLabel';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { FlowOptions } from '@/src/features/registration/forms/formRegistrationFlowSelection';
import { registrationActions } from '@/src/use-cases/registration';
import {
  StyledWizardSummaryActions,
  StyledWizardSummaryContainer,
} from './WizardSummary.styles';

const flowSelectOptions = FlowOptions.map((option) => ({
  value: option.value,
  label: (
    <SelectOptionTitleIconDescriptionLabel
      title={option.label}
      icon={option.icon}
      description={option.description}
    />
  ),
}));

interface WizardSummaryProps {
  value: RegistrationFlow[];
  onChange: (flows: RegistrationFlow[]) => void;
}

export const WizardSummary = ({ value, onChange }: WizardSummaryProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(registrationActions.resetRegistrationData());
  }, [dispatch]);

  const selectedFlow = value[0] ?? null;

  const handleStart = () => {
    if (!selectedFlow) {
      return;
    }
    dispatch(
      registrationActions.moveForwardInRegistration({
        flow: selectedFlow,
        step: 0,
      })
    );
    router.push(`/wizard/run?flow=${selectedFlow}`);
  };

  return (
    <StyledWizardSummaryContainer>
      <H4 title="Créer mon compte Entourage Pro en 5 minutes" />
      <Text>Faisons connaissance : quelle est votre situation actuelle ?</Text>

      <br />

      <SelectList
        id="wizard-flow-selection"
        name="flow"
        options={flowSelectOptions}
        value={value}
        onChange={onChange}
        isMulti={false}
        asGrid
      />

      <StyledWizardSummaryActions>
        <Button onClick={handleStart} disabled={!selectedFlow} size="large">
          Commencer l'inscription
        </Button>
      </StyledWizardSummaryActions>
    </StyledWizardSummaryContainer>
  );
};
