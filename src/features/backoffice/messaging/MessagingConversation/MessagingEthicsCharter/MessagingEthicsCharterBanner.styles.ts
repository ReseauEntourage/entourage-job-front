import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledMessagingEthicsCharterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const StyledMessagingEthicsCharterHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

/**
 * Deux colonnes indépendantes, et non une grille de rangées : une grille
 * cale chaque rangée sur sa section la plus haute, si bien qu'une section
 * d'une seule puce laisse un vide sous elle avant la rangée suivante.
 * Chaque colonne porte donc son propre espacement, uniforme, et les deux
 * s'alignent par le haut.
 */
export const StyledMessagingEthicsCharterSections = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 32px;
  align-items: start;
`;

export const StyledMessagingEthicsCharterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

export const StyledMessagingEthicsCharterSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
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

export const StyledMessagingEthicsCharterActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
`;

/**
 * Barre repliée affichée sur mobile à la place du bloc : seuls le titre et le
 * chevron sont visibles, l'appui ouvre le panneau plein écran. Sans croix de
 * fermeture — la fermeture passe par « J'ai compris » dans le panneau.
 */
export const StyledMessagingEthicsCharterBar = styled.button`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 20px;
  border: 1px solid ${COLORS.primaryBlue};
  border-left: none;
  border-right: none;
  background-color: ${COLORS.hoverBlue};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  flex-shrink: 0;
`;

export const StyledMessagingEthicsCharterBarLabel = styled.span`
  flex-grow: 1;
  min-width: 0;
`;

/**
 * Panneau plein écran mobile. Colonne flex : en-tête et pied fixes, contenu
 * défilant au milieu, pour que « J'ai compris » reste atteignable quelle que
 * soit la hauteur de l'écran ou la taille de police système.
 */
export const StyledMessagingEthicsCharterPanel = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1040;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.white};
`;

export const StyledMessagingEthicsCharterPanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-sizing: border-box;
  padding: 14px 16px;
  background-color: ${COLORS.hoverBlue};
  border-bottom: 1px solid ${COLORS.lightGray};
  flex-shrink: 0;
`;

export const StyledMessagingEthicsCharterPanelTitle = styled.div`
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const StyledMessagingEthicsCharterPanelBody = styled.div`
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledMessagingEthicsCharterPanelFooter = styled.div`
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 16px;
  border-top: 1px solid ${COLORS.gray};
  background-color: ${COLORS.white};

  button {
    width: 100%;
  }
`;

export const StyledMessagingEthicsCharterPoints = styled.ul`
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledMessagingEthicsCharterPanelClose = styled.button`
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

/**
 * Lien natif plutôt que `Button href newTab` : la prop `newTab` du composant
 * n'a d'effet que sur un lien externe, et y pose `target="_"` au lieu de
 * `_blank`. Couleur `extraDarkGray` soulignée et non `primaryBlue` : sur le
 * fond `hoverBlue` du bandeau, primaryBlue tombe à 2,4:1.
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
