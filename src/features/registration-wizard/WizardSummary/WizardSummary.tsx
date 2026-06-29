import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, LucidIcon, Text } from '@/src/components/ui';
import { H1 } from '@/src/components/ui/Headings';
import { SelectList } from '@/src/components/ui/Inputs/SelectList';
import { SelectOptionTitleIconDescriptionLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionTitleIconDescriptionLabel/SelectOptionTitleIconDescriptionLabel';
import { COLORS } from '@/src/constants/styles';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { FlowOptions } from '@/src/features/registration/forms/formRegistrationFlowSelection';
import { registrationActions } from '@/src/use-cases/registration';
import {
  StyledWizardReassuranceItem,
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
      <H1 title="Qu’est-ce qui vous amène ?" />
      <Text>Choisissez ce qui vous correspond le mieux pour commencer.</Text>

      <br />

      <SelectList
        id="wizard-flow-selection"
        name="flow"
        options={flowSelectOptions}
        value={value}
        onChange={onChange}
        isMulti={false}
      />

      <StyledWizardSummaryActions>
        <Button onClick={handleStart} disabled={!selectedFlow} size="large">
          Commencer l'inscription
        </Button>
      </StyledWizardSummaryActions>

      <StyledWizardSummaryActions>
        <StyledWizardReassuranceItem>
          <LucidIcon name="Check" color={COLORS.green} size={20} />
          <Text color="darkGray">Gratuit</Text>
        </StyledWizardReassuranceItem>

        <StyledWizardReassuranceItem>
          <LucidIcon name="Check" color={COLORS.green} size={20} />
          <Text color="darkGray">Sans engagement</Text>
        </StyledWizardReassuranceItem>
      </StyledWizardSummaryActions>

      <Text center>
        Vous avez déjà un compte ? <Link href="/login">Connectez-vous</Link>
      </Text>
    </StyledWizardSummaryContainer>
  );
};
