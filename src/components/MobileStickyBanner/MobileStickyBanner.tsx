import React from 'react';
import { PanelState } from 'src/use-cases/wizard/wizard.types';
import {
  StyledBannerCount,
  StyledBannerText,
  StyledMobileStickyBanner,
} from './MobileStickyBanner.styles';

interface MobileStickyBannerProps {
  panelState: PanelState;
  suggestionsCount: number;
}

export const MobileStickyBanner = ({
  panelState,
  suggestionsCount,
}: MobileStickyBannerProps) => {
  const isVisible = panelState !== 'teaser';

  return (
    <StyledMobileStickyBanner isVisible={isVisible}>
      <StyledBannerText>
        {panelState === 'loading'
          ? 'Recherche de profils compatibles…'
          : `${suggestionsCount} profil${suggestionsCount > 1 ? 's' : ''} compatible${suggestionsCount > 1 ? 's' : ''} trouvé${suggestionsCount > 1 ? 's' : ''}`}
      </StyledBannerText>
      {panelState === 'results' && suggestionsCount > 0 && (
        <StyledBannerCount>{suggestionsCount}</StyledBannerCount>
      )}
    </StyledMobileStickyBanner>
  );
};
