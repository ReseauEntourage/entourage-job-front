import React from 'react';
import { Button } from '@/src/components/ui';
import { ProfileGenerationLoadingIndicator } from '@/src/features/profile/ai/ProfileGenerationLoadingIndicator';
import { StyledContainer } from './CvLoadingAnimation.styles';

interface PresentationGenerationPendingProps {
  text: string;
  writeMyselfLabel: string;
  onWriteMyself: () => void;
}

// Shown in place of the presentation field while the AI proposal is being
// generated; the user can stop waiting at any time.
export const PresentationGenerationPending = ({
  text,
  writeMyselfLabel,
  onWriteMyself,
}: PresentationGenerationPendingProps) => (
  <StyledContainer role="status" aria-live="polite">
    <ProfileGenerationLoadingIndicator imageSize={100} text={text} />
    <Button variant="secondary" onClick={onWriteMyself}>
      {writeMyselfLabel}
    </Button>
  </StyledContainer>
);
