import React, { useEffect, useState } from 'react';
import { ProfileRecommendation } from '@/src/api/types';
import { Api } from 'src/api';
import { WizardCompatibleProfileCard } from './WizardCompatibleProfileCard';
import {
  StyledContainer,
  StyledHeader,
  StyledLabel,
  StyledLoadingMessage,
  StyledProfileList,
  StyledSkeletonCard,
} from './WizardRecommendationsSidePanel.styles';

const RECOMMENDATIONS_LIMIT = 3;
const SKELETON_COUNT = 3;

export const WizardRecommendationsSidePanel = () => {
  const [recommendations, setRecommendations] = useState<
    ProfileRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Api.getProfilesRecommendations({ limit: RECOMMENDATIONS_LIMIT })
      .then(({ data }) => {
        if (!cancelled) {
          setRecommendations(data.recommendations ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecommendations([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledLabel>Votre sélection personnalisée</StyledLabel>
        {isLoading && (
          <StyledLoadingMessage>
            Nous analysons votre profil pour vous proposer une sélection de
            coachs qui vous correspondent. Continuez votre formation, les
            résultats apparaîtront ici.
          </StyledLoadingMessage>
        )}
      </StyledHeader>
      <StyledProfileList>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <StyledSkeletonCard key={i} />
            ))
          : recommendations.map((rec) => (
              <WizardCompatibleProfileCard
                key={rec.id}
                profile={rec.publicProfile}
                subtitleContext="sectors"
              />
            ))}
      </StyledProfileList>
    </StyledContainer>
  );
};
