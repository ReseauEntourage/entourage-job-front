import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Text } from '@/src/components/ui';
import { OpenAILegalMention } from '@/src/features/profile/ai/OpenAILegalMention';
import { ProfileGenerationLoadingIndicator } from '@/src/features/profile/ai/ProfileGenerationLoadingIndicator';
import {
  CV_GENERATION_ESTIMATED_DURATION_MS,
  CV_GENERATION_TIMEOUT_MS,
} from './cvLoading.constants';

const MESSAGES = [
  'Analyse de votre CV…',
  'Extraction de vos expériences…',
  'Extraction de vos compétences…',
  'Identification de vos langues…',
];

const MESSAGE_INTERVAL_MS =
  CV_GENERATION_ESTIMATED_DURATION_MS / MESSAGES.length;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 48px 24px;
  text-align: center;
`;

interface CvLoadingAnimationProps {
  onManualFallback: () => void;
}

export const CvLoadingAnimation = ({
  onManualFallback,
}: CvLoadingAnimationProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTimeoutReached, setIsTimeoutReached] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev >= MESSAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTimeoutReached(true);
    }, CV_GENERATION_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <StyledContainer>
      <ProfileGenerationLoadingIndicator text={MESSAGES[messageIndex]} />
      <Text size="small" color="darkGray">
        Votre profil est en cours de génération. Cela prend environ 30 secondes.
      </Text>
      {isTimeoutReached && (
        <>
          <Text size="small" color="darkGray">
            Cela prend plus de temps que prévu. Vous pouvez continuer à attendre
            ou remplir votre profil vous-même.
          </Text>
          <Button variant="secondary" onClick={onManualFallback}>
            Remplir mon profil moi-même
          </Button>
        </>
      )}
      <OpenAILegalMention />
    </StyledContainer>
  );
};
