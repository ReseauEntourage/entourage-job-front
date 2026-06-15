import React from 'react';
import { CoachCard } from 'src/components/CoachCard';
import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { PanelState, SuggestedProfile } from 'src/use-cases/wizard/wizard.types';
import {
  StyledPanel,
  StyledPanelSubtitle,
  StyledPanelTitle,
  StyledSkeletonList,
  StyledSuggestionsList,
  StyledTeaserIcon,
} from './PanelSuggestions.styles';

interface PanelSuggestionsProps {
  panelState: PanelState;
  suggestions: SuggestedProfile[];
}

export const PanelSuggestions = ({
  panelState,
  suggestions,
}: PanelSuggestionsProps) => {
  return (
    <StyledPanel>
      <StyledPanelTitle>Profils compatibles</StyledPanelTitle>

      {panelState === 'teaser' && (
        <>
          <StyledTeaserIcon>🔍</StyledTeaserIcon>
          <StyledPanelSubtitle>
            Complétez votre profil pour découvrir les coachs qui correspondent à
            vos besoins.
          </StyledPanelSubtitle>
        </>
      )}

      {panelState === 'loading' && (
        <>
          <StyledPanelSubtitle>
            Nous cherchons les profils les plus compatibles avec vous…
          </StyledPanelSubtitle>
          <StyledSkeletonList>
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} height="72px" width="100%" />
            ))}
          </StyledSkeletonList>
        </>
      )}

      {panelState === 'results' && (
        <>
          <StyledPanelSubtitle>
            {suggestions.length > 0
              ? `${suggestions.length} profil${suggestions.length > 1 ? 's' : ''} compatible${suggestions.length > 1 ? 's' : ''} trouvé${suggestions.length > 1 ? 's' : ''}`
              : 'Aucun profil compatible trouvé pour le moment.'}
          </StyledPanelSubtitle>
          {suggestions.length > 0 && (
            <StyledSuggestionsList>
              {suggestions.map((profile) => (
                <CoachCard key={profile.userId} profile={profile} />
              ))}
            </StyledSuggestionsList>
          )}
        </>
      )}
    </StyledPanel>
  );
};
