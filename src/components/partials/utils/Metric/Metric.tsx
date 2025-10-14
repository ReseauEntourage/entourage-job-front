import React from 'react';
import { Card, Text } from '@/src/components/utils';
import {
  StyledBubble,
  StyledCoverContainer,
  StyledMetricCard,
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
    <Card>
      <StyledMetricCard>
        <StyledCoverContainer imageUrl={metric.imageUrl}>
          <StyledBubble position={metric.bubblePosition}>
            <Text size="large">{metric.value}</Text>
            <Text>{metric.description}</Text>
          </StyledBubble>
        </StyledCoverContainer>
        <StyledTitleAndSourceContainer>
          <Text weight="bold" center>
            {metric.title}
          </Text>
          <Text center>{metric.source}</Text>
        </StyledTitleAndSourceContainer>
      </StyledMetricCard>
    </Card>
  );
};
