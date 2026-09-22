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
 * Le reste de la modale — voile, largeur, en-tête, corps défilant, pied,
 * feuille mobile — vient de `ModalGeneric` : il ne reste ici que le contenu
 * propre au résumé de la charte.
 */
export const StyledMessagingEthicsCharterSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0 20px 0;
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
