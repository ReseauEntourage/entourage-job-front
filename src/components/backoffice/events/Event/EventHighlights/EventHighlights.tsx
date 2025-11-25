import React from 'react';
import { Event } from '@/src/api/types';
import { COLORS } from '@/src/constants/styles';
import { Card, LucidIcon } from 'src/components/utils';
import { StyledItemsContainer } from './EventHighlights.styles';
import { Item } from './Item/Item';

export type EventHighlightsProps = Pick<
  Event,
  'duration' | 'format' | 'goal' | 'audience'
>;

export const EventHighlights = ({
  duration,
  format,
  goal,
  audience,
}: EventHighlightsProps) => {
  return (
    <Card title="Points clefs de l'événement">
      <StyledItemsContainer>
        <Item
          icon={<LucidIcon name="Clock" size={30} color={COLORS.primaryBlue} />}
          title="Durée"
          content={`${duration} minutes d'échanges enrichissants`}
        />

        <Item
          icon={<LucidIcon name="Users" size={30} color={COLORS.primaryBlue} />}
          title="Pour qui ?"
          content={audience || ''}
        />

        <Item
          icon={
            <LucidIcon
              name="MessageCircle"
              size={30}
              color={COLORS.primaryBlue}
            />
          }
          title="Format"
          content={format || ''}
        />

        <Item
          icon={
            <LucidIcon name="Target" size={30} color={COLORS.primaryBlue} />
          }
          title="Objectif"
          content={goal || ''}
        />
      </StyledItemsContainer>
    </Card>
  );
};
