import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { LucidIcon, Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';

const MESSAGES = [
  'Analyse de votre CV…',
  'Extraction de vos expériences…',
  'Extraction de vos compétences…',
  'Identification de vos langues…',
];

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 48px 24px;
  text-align: center;
`;

const StyledIconWrapper = styled.div`
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const CvLoadingAnimation = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledContainer>
      <StyledIconWrapper>
        <LucidIcon name="Sparkles" size={64} color={COLORS.primaryBlue} />
      </StyledIconWrapper>
      <Text weight="semibold">{MESSAGES[messageIndex]}</Text>
      <Text size="small" color="darkGray">
        Votre profil est en cours de génération. Cela prend environ 30 secondes.
      </Text>
    </StyledContainer>
  );
};
