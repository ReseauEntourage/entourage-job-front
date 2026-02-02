import { useMemo } from 'react';
import { Button, Card, LucidIcon, Text } from '@/src/components/ui';
import { NumberCheckableBadge } from '@/src/components/ui/Badge/NumberCheckableBadge/NumberCheckableBadge';
import { H4 } from '@/src/components/ui/Headings';
import { openModal } from '@/src/features/modals/Modal';
import { ElearningUnitModal } from '../elearning-unit-modal/ElearningUnitModal';
import { ElearningUnit } from '../elearning.types';
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
  const isCompleted = useMemo(() => {
    return elearningUnit.userCompletions.length > 0;
  }, [elearningUnit.userCompletions]);

  const start = () => {
    openModal(<ElearningUnitModal elearningUnit={elearningUnit} />);
  };

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
          <Button onClick={() => start()} disabled={isCompleted}>
            {!isCompleted ? (
              <>
                <LucidIcon name="Play" /> &nbsp;Démarrer
              </>
            ) : (
              <>
                <LucidIcon name="Check" /> &nbsp;Terminé
              </>
            )}
          </Button>
        </StyledElearningUnitCardMetaContainer>
      </StyledElearningUnitCardContainer>
    </Card>
  );
};
