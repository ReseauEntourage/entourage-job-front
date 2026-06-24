import React, { useCallback, useEffect, useState } from 'react';
import { ProfileRecommendation } from '@/src/api/types';
import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { Text } from '@/src/components/ui/Text';
import { Api } from 'src/api';
import { useEmbeddingStatus } from 'src/hooks/useEmbeddingStatus';
import { WizardCompatibleProfileCard } from './WizardCompatibleProfileCard';
import {
  StyledContainer,
  StyledHeader,
  StyledProfileList,
} from './WizardRecommendationsSidePanel.styles';

const RECOMMENDATIONS_LIMIT = 3;
const SKELETON_COUNT = 3;

type PanelState = 'LOADING' | 'EMBEDDING_PENDING' | 'COMPUTING_RECO' | 'READY';

export const WizardRecommendationsSidePanel = () => {
  const [panelState, setPanelState] = useState<PanelState>('LOADING');
  const [recommendations, setRecommendations] = useState<
    ProfileRecommendation[]
  >([]);

  const fetchReco = useCallback(async () => {
    try {
      const { data } = await Api.getProfilesRecommendations({
        limit: RECOMMENDATIONS_LIMIT,
      });
      if (data.embeddingPending) {
        setPanelState('EMBEDDING_PENDING');
      } else {
        setRecommendations(data.recommendations ?? []);
        setPanelState('READY');
      }
    } catch {
      setRecommendations([]);
      setPanelState('READY');
    }
  }, []);

  const handleEmbeddingReady = useCallback(() => {
    setPanelState('COMPUTING_RECO');
    fetchReco();
  }, [fetchReco]);

  useEmbeddingStatus({
    onReady: handleEmbeddingReady,
    enabled: panelState === 'EMBEDDING_PENDING',
  });

  useEffect(() => {
    fetchReco();
  }, [fetchReco]);

  const isLoading = panelState === 'LOADING' || panelState === 'COMPUTING_RECO';

  return (
    <StyledContainer>
      <StyledHeader>
        <Text color="white" uppercase weight="semibold">
          Votre sélection personnalisée
        </Text>
        {panelState === 'EMBEDDING_PENDING' && (
          <Text color="white">
            Nous analysons les modifications récentes de votre profil afin de
            vous proposer les profils les plus susceptibles de vous intéresser
          </Text>
        )}
        {panelState === 'COMPUTING_RECO' && (
          <Text color="white">
            Votre profil est prêt ! Nous analysons les profils de la communauté
            afin de vous proposer les profils les plus susceptibles de vous
            intéresser
          </Text>
        )}
      </StyledHeader>
      <StyledProfileList>
        {isLoading || panelState === 'EMBEDDING_PENDING' ? (
          <Skeleton
            count={SKELETON_COUNT}
            width="100%"
            height="50px"
            inverted
          />
        ) : (
          recommendations.map((rec) => (
            <WizardCompatibleProfileCard
              key={rec.id}
              profile={rec.publicProfile}
              subtitleContext="sectors"
            />
          ))
        )}
      </StyledProfileList>
    </StyledContainer>
  );
};
