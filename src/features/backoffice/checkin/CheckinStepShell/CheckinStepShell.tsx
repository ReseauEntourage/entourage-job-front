import React from 'react';
import { Button, Text } from '@/src/components/ui';
import { Card } from '@/src/components/ui/Cards/Card';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile';
import { UserRoles } from '@/src/constants/users';
import { useIsDesktop } from '@/src/hooks/utils';
import { CHECKIN_QUESTION_STEP_ORDER } from '../CheckinFlow/checkin-flow.constants';
import { CheckinProgressBar } from '../CheckinProgressBar/CheckinProgressBar';
import {
  StyledCheckinStepContent,
  StyledCheckinStepError,
  StyledCheckinStepFooter,
  StyledCheckinStepHeader,
  StyledCheckinStepProgress,
  StyledCheckinStepShell,
} from './CheckinStepShell.styles';

const TOTAL_STEPS = CHECKIN_QUESTION_STEP_ORDER.length;

interface CheckinStepShellProps {
  otherParticipant: { id: string; firstName: string; role: UserRoles };
  otherParticipantHasPicture: boolean;
  currentIdx: number;
  question: string;
  children: React.ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  secondaryAction?: { label: string; onClick: () => void };
}

export const CheckinStepShell = ({
  otherParticipant,
  otherParticipantHasPicture,
  currentIdx,
  question,
  children,
  canContinue,
  onContinue,
  isSubmitting = false,
  error = null,
  secondaryAction,
}: CheckinStepShellProps) => {
  const isDesktop = useIsDesktop();

  const content = (
    <>
      <StyledCheckinStepHeader>
        <ImgUserProfile
          user={otherParticipant}
          hasPicture={otherParticipantHasPicture}
          size={32}
        />
        <Text size="large" weight="semibold">
          Vos échanges avec {otherParticipant.firstName}
        </Text>
      </StyledCheckinStepHeader>
      <br />
      <StyledCheckinStepProgress>
        <CheckinProgressBar
          current={Math.min(currentIdx + 1, TOTAL_STEPS)}
          total={TOTAL_STEPS}
        />
      </StyledCheckinStepProgress>
      <br />
      <StyledCheckinStepContent>
        <Text weight="semibold" size="xxlarge">
          {question}
        </Text>
        {children}
      </StyledCheckinStepContent>
      <StyledCheckinStepFooter>
        {error && (
          <StyledCheckinStepError>
            <Text color="lightRed">{error}</Text>
          </StyledCheckinStepError>
        )}
        <Button onClick={onContinue} disabled={!canContinue || isSubmitting}>
          Continuer
        </Button>
        {secondaryAction && (
          <Button variant="text" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </StyledCheckinStepFooter>
    </>
  );

  return (
    <StyledCheckinStepShell>
      {isDesktop ? <Card>{content}</Card> : content}
    </StyledCheckinStepShell>
  );
};
