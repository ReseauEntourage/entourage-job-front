import React from 'react';
import { LegacyImg } from '@/src/components/ui';
import { StyledContainerMarginY } from '@/src/components/ui/Containers/Containers.styles';
import { Text } from '@/src/components/ui/Text';
import { StyledImageContainer } from './ProfileGenerationLoadingIndicator.styles';

interface ProfileGenerationLoadingIndicatorProps {
  imageSize?: number;
  text?: string;
}

export const ProfileGenerationLoadingIndicator = ({
  imageSize = 150,
  text = 'Patientez quelques secondes ...',
}: ProfileGenerationLoadingIndicatorProps) => {
  return (
    <StyledImageContainer>
      <LegacyImg
        src="/static/img/illustrations/cv-ia.gif"
        width={imageSize}
        height={imageSize}
        alt="Chargement en cours"
      />
      <StyledContainerMarginY margin="20px" />
      <Text weight="bold" size="normal" center>
        {text}
      </Text>
    </StyledImageContainer>
  );
};
