import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

const WAVE_HEIGHT_MOBILE = 40;
const WAVE_HEIGHT_DESKTOP = 80;

// Hauteur minimum du hero (image + bloc texte), pour éviter un hero trop bas
// sur les pages à contenu court et garantir une image de bonne taille.
const CONTENT_MIN_HEIGHT_MOBILE = 380;
const CONTENT_MIN_HEIGHT_DESKTOP = 460;
const IMAGE_CARD_MIN_HEIGHT_MOBILE = 260;

// Espace réservé sous la carte du menu public flottant (NavPublic), qui est
// position: fixed et ne réserve plus d'espace dans le flux de la page.
const DESKTOP_TOP_GAP = 24;
const MOBILE_TOP_GAP = 16;
const DESKTOP_NAV_SPACE = `calc(${HEIGHTS.PUBLIC_NAV_OFFSET_TOP}px + ${HEIGHTS.PUBLIC_NAV_CARD}px + ${DESKTOP_TOP_GAP}px)`;
const MOBILE_NAV_SPACE = `calc(${HEIGHTS.PUBLIC_NAV_OFFSET_TOP_MOBILE}px + ${HEIGHTS.PUBLIC_NAV_CARD_MOBILE}px + ${MOBILE_TOP_GAP}px)`;

export const StyledPageHero = styled.section`
  position: relative;
  background-color: ${COLORS.primaryBlue};
  overflow: hidden;
  padding: ${MOBILE_NAV_SPACE} 20px ${WAVE_HEIGHT_MOBILE + 20}px;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    padding: ${DESKTOP_NAV_SPACE} 50px ${WAVE_HEIGHT_DESKTOP + 40}px;
  }
`;

export const StyledPageHeroContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1314px;
  margin: 0 auto;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 32px;
  min-height: ${CONTENT_MIN_HEIGHT_MOBILE}px;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: row;
    align-items: stretch;
    gap: 60px;
    min-height: ${CONTENT_MIN_HEIGHT_DESKTOP}px;
  }
`;

export const StyledPageHeroImageCard = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: ${IMAGE_CARD_MIN_HEIGHT_MOBILE}px;
  border-radius: 24px;
  overflow: hidden;
  flex-shrink: 0;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    width: 45%;
    /* Sur desktop, la carte s'étire (align-items: stretch du parent) pour
       occuper toute la hauteur du hero plutôt que d'être bornée par son
       propre ratio d'aspect. */
    aspect-ratio: unset;
    min-height: 0;
  }
`;

export const StyledPageHeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 15px;
  width: 100%;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    width: 55%;
    gap: 20px;
  }
`;

export const StyledPageHeroCTAsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;

  button:first-child {
    margin-right: 8px;
  }
  button {
    margin-top: 4px;
  }
`;

export const StyledPageHeroWave = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${WAVE_HEIGHT_MOBILE}px;
  line-height: 0;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    height: ${WAVE_HEIGHT_DESKTOP}px;
  }
`;
