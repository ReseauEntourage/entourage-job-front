import { useMemo } from 'react';
import {
  Button,
  Card,
  LucidIcon,
  Tag,
  TagSize,
  TagVariant,
  Text,
} from '@/src/components/ui';
import { NumberCheckableBadge } from '@/src/components/ui/Badge/NumberCheckableBadge/NumberCheckableBadge';
import { H4 } from '@/src/components/ui/Headings';
import { ElearningUnit } from '../elearning.types';
import { useElearning } from '../useElearning';
import {
  StyledElearningUnitCardContainer,
  StyledElearningUnitCardContentContainer,
  StyledElearningUnitCardMetaContainer,
} from './ElearningUnitCard.styles';

export interface ElearningUnitCardProps {
  elearningUnit: ElearningUnit;
  idx?: number;
}

export const ElearningUnitCard = ({
  elearningUnit,
  idx,
}: ElearningUnitCardProps) => {
  const { completeUnit } = useElearning();
  const isCompleted = useMemo(() => {
    return elearningUnit.userCompletions.length > 0;
  }, [elearningUnit.userCompletions]);

  return (
    <Card>
      <StyledElearningUnitCardContainer>
        <StyledElearningUnitCardContentContainer>
          {idx !== undefined && (
            <div>
              <NumberCheckableBadge number={idx + 1} checked={isCompleted} />
            </div>
          )}
          <div>
            <H4 title={elearningUnit.title} noMarginBottom />
            <Text size="large">{elearningUnit.description}</Text>
          </div>
        </StyledElearningUnitCardContentContainer>
        <StyledElearningUnitCardMetaContainer>
          <Text size="large">
            <LucidIcon name="Clock" /> {elearningUnit.durationMinutes} minutes
          </Text>
          {!isCompleted ? (
            <Button onClick={() => completeUnit(elearningUnit.id)}>
              <LucidIcon name="Play" /> &nbsp;Démarrer
            </Button>
          ) : (
            <Tag size={TagSize.Large} variant={TagVariant.PrimaryBlue}>
              <LucidIcon name="Check" /> &nbsp;Complété
            </Tag>
          )}
        </StyledElearningUnitCardMetaContainer>
      </StyledElearningUnitCardContainer>
    </Card>
  );
};
