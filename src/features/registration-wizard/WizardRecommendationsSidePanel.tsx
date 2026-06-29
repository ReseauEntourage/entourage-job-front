import React, { useCallback, useEffect, useState } from 'react';
import { ProfileRecommendation } from '@/src/api/types';
import { WizardSidePanel } from '@/src/components/ui/WizardSidePanel';
import { Api } from 'src/api';
import { useEmbeddingStatus } from 'src/hooks/useEmbeddingStatus';
import { WizardCompatibleProfileCard } from './WizardCompatibleProfileCard';
import { StyledProfileList } from './WizardRecommendationsSidePanel.styles';
import {
  SEARCHING_LOADER_VARIANTS,
  WizardSearchingLoader,
} from './WizardSearchingLoader';

const RECOMMENDATIONS_LIMIT = 3;

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

  return (
    <WizardSidePanel title="VOTRE SÉLECTION PERSONNALISÉE">
      <StyledProfileList>
        {panelState !== 'READY' ? (
          <WizardSearchingLoader
            {...SEARCHING_LOADER_VARIANTS[
              panelState === 'EMBEDDING_PENDING'
                ? 'embeddingPending'
                : 'computingReco'
            ]}
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
    </WizardSidePanel>
  );
};
