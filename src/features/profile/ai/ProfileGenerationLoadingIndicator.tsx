import React from 'react';
import styled from 'styled-components';
import { LegacyImg } from '@/src/components/ui';
import { StyledContainerMarginY } from '@/src/components/ui/Containers/Containers.styles';
import { Text } from '@/src/components/ui/Text';

const StyledImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  height: 200px;
`;

export interface ProfileGenerationLoadingIndicatorProps {
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
