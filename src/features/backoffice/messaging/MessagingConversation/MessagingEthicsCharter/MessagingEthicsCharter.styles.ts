import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

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
 * Le voile, la largeur, les rayons et la feuille mobile viennent de la modale
 * du produit (`src/features/modals/Modal`) : ne restent ici que l'en-tête, le
 * corps défilant et le pied, alignés sur ses gouttières de 50 px (20 px sous
 * le point de rupture desktop).
 */
export const StyledMessagingEthicsCharterModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-sizing: border-box;
  flex-shrink: 0;
  /* Dégage la croix de fermeture de la modale, posée à 30 px du bord. */
  padding: 0 70px 0 50px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 60px 0 20px;
  }
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
