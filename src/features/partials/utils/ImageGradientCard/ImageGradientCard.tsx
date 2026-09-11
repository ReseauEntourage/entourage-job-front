import React from 'react';
import { LegacyImg, Text } from '@/src/components/ui';
import { H4 } from '@/src/components/ui/Headings';
import {
  StyledGradientOverlay,
  StyledImageGradientCard,
  StyledImageLayer,
  StyledTextLayer,
} from './ImageGradientCard.styles';

interface ImageGradientCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  img: string;
  alt: string;
}

export const ImageGradientCard = ({
  title,
  description,
  img,
  alt,
}: ImageGradientCardProps) => {
  return (
    <StyledImageGradientCard>
      <StyledImageLayer>
        <LegacyImg src={img} alt={alt} cover />
      </StyledImageLayer>
      <StyledGradientOverlay />
      <StyledTextLayer>
        <H4 title={title} color="white" weight="bold" noMarginBottom />
        <Text size="small" color="white">
          {description}
        </Text>
      </StyledTextLayer>
    </StyledImageGradientCard>
  );
};
