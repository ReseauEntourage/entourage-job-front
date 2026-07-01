import React from 'react';
import { Section } from '@/src/components/ui';
import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { ElearningProgressTracker } from '@/src/features/backoffice/elearning/elearning-progress-tracker/ElearningProgressTracker';
import { ElearningUnitCard } from '@/src/features/backoffice/elearning/elearning-unit-card/ElearningUnitCard';
import { useElearning } from '@/src/features/backoffice/elearning/useElearning';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackofficeBackground } from '../../Backoffice.styles';
import { StyledElearningUnitsContainer } from './formations.styles';

export const Formations = () => {
  const { isLoading, elearningUnits } = useElearning();

  return (
    <>
      <Section className="custom-page">
        <HeaderBackoffice
          title="Formations"
          description="Retrouvez et complétez vos modules de formation."
          noSeparator
        />
      </Section>
      <StyledBackofficeBackground>
        <Section className="custom-page">
          <ElearningProgressTracker />
          {isLoading && (
            <Skeleton height="130px" width="100%" count={4} inverted />
          )}
          <StyledElearningUnitsContainer>
            {!isLoading &&
              elearningUnits &&
              elearningUnits.map((unit, idx) => (
                <ElearningUnitCard
                  key={unit.id}
                  idx={idx}
                  elearningUnit={unit}
                />
              ))}
          </StyledElearningUnitsContainer>
        </Section>
      </StyledBackofficeBackground>
    </>
  );
};
