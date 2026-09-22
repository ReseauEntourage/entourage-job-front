import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

/**
 * Ligne discrète au-dessus de l'éditeur : elle survit à la fermeture de la
 * modale et reste le seul rappel permanent de la charte dans la conversation.
 */
export const StyledMessagingEthicsCharterNote = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  padding: 0 20px 6px 20px;
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 16px 6px 16px;
  }
`;

export const StyledMessagingEthicsCharterNoteLink = styled.a`
  color: ${COLORS.darkGray};
  text-decoration: underline;

  &:hover {
    color: ${COLORS.darkBlue};
  }
`;

/**
 * Reprend la mécanique de la modale du produit (`src/features/modals/Modal`) :
 * même voile, même largeur, mêmes rayons, et sur mobile une feuille qui part
 * du bas du header. La modale est rendue ici plutôt qu'ouverte par
 * `openModal()` car elle s'ouvre d'elle-même au montage : le flux `openModal`
 * passe par un `Subject` RxJS sans rejeu, qui perd une modale émise avant que
 * son écouteur soit monté.
 */
export const StyledMessagingEthicsCharterOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    align-items: flex-end;
  }
`;

export const StyledMessagingEthicsCharterModal = styled.div`
  width: 640px;
  max-width: calc(100% - 30px);
  max-height: 90vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.white};
  border-radius: 20px;
  padding: 30px 0;
  box-shadow: 0 28px 50px rgba(0, 0, 0, 0.16);

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
    max-width: 100%;
    margin-top: ${HEIGHTS.HEADER_MOBILE}px;
    max-height: calc(100vh - ${HEIGHTS.HEADER_MOBILE}px);
    border-radius: 25px 25px 0 0;
    padding: 20px 0;
  }
`;

export const StyledMessagingEthicsCharterModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-sizing: border-box;
  padding: 0 50px;
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 20px;
  }
`;

export const StyledMessagingEthicsCharterModalTitle = styled.div`
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledMessagingEthicsCharterModalClose = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
`;

export const StyledMessagingEthicsCharterModalBody = styled.div`
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 24px 50px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 20px;
  }
`;

export const StyledMessagingEthicsCharterModalFooter = styled.div`
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 50px 0 50px;
  border-top: 1px solid ${COLORS.lightGray};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column-reverse;
    align-items: stretch;
    padding: 16px 20px 0 20px;
  }
`;

/**
 * Bouton plein sur fond `darkBlue` plutôt que la variante `primary` de
 * `Button` : blanc sur `primaryBlue` tombe à 2,8:1, et le design system
 * recommande lui-même `darkBlue` comme fond dans ce cas (4,6:1). `Button`
 * n'expose pas ce fond — sa prop `color` ne change que la couleur du texte.
 */
export const StyledMessagingEthicsCharterAcknowledge = styled.button`
  box-sizing: border-box;
  padding: 10px 28px;
  border: none;
  border-radius: 20px;
  background-color: ${COLORS.darkBlue};
  color: ${COLORS.white};
  font-family: inherit;
  font-size: 16px;
  line-height: 27.2px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${COLORS.extraDarkBlue};
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const StyledMessagingEthicsCharterSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const StyledMessagingEthicsCharterSectionIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 3px;
`;

export const StyledMessagingEthicsCharterSectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const StyledMessagingEthicsCharterPoints = styled.ul`
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/**
 * Lien natif plutôt que `Button href newTab` : la prop `newTab` du composant
 * n'a d'effet que sur un lien externe, et y pose `target="_"` au lieu de
 * `_blank`.
 */
export const StyledMessagingEthicsCharterLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${COLORS.extraDarkGray};
  text-decoration: underline;

  &:hover {
    color: ${COLORS.darkBlue};
  }
`;
