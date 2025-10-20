import React from 'react';
import { Card, Image, Text } from '@/src/components/utils';
import { COLORS } from '@/src/constants/styles';
import {
  StyledCoverContainer,
  StyledMetricCard,
  StyledSourceContainer,
  StyledTitleAndSourceContainer,
} from './Metric.styles';
import { BubblePosition } from './Metric.types';

export interface Metric {
  title: string;
  value: string;
  description: string;
  source: string;
  imageUrl: string;
  bubblePosition?: BubblePosition;
}

export interface MetricCardProps {
  metric: Metric;
}

export const MetricCard = ({ metric }: MetricCardProps) => {
  return (
    <Card borderColor={COLORS.gray}>
      <StyledMetricCard>
        <StyledCoverContainer>
          <Image src={metric.imageUrl} alt={metric.title} cover />
        </StyledCoverContainer>
        <StyledTitleAndSourceContainer>
          <Text size="xlarge" weight="bold">
            {metric.value}
          </Text>
          <Text size="small" color="darkGray">
            {metric.description}
          </Text>
          <StyledSourceContainer>
            <Text weight="bold">{metric.title}</Text>
            <Text>{metric.source}</Text>
          </StyledSourceContainer>
        </StyledTitleAndSourceContainer>
      </StyledMetricCard>
    </Card>
  );
};
