import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledElearningUnitContent = styled.div<{
  noPadding?: boolean;
}>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: ${(props) => (props.noPadding ? '0' : '30px')};
  gap: 16px;
`;

export const StyledElearningUnitVideoFrame = styled.div<{
  isShorts: boolean;
}>`
  display: flex;
  justify-content: center;
  padding: 0 30px;

  /*
    Le player react-lite-youtube-embed se dimensionne par sa largeur (aspect-ratio
    CSS géré par la lib elle-même) : on se contente de contraindre cette largeur.
    Ne dépend d'aucune hauteur ambiante — fonctionne dans un modal, un side panel
    ou un bloc inline, contrairement à une approche basée sur des container query
    height (cqh), qui s'effondre à 0 dès que l'ancêtre n'a pas de hauteur définie.
  */
  .video-inner {
    width: 100%;
    max-width: ${(props) => (props.isShorts ? '360px' : '640px')};
  }
`;

export const StyledElearningQuestionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border: 2px solid ${COLORS.gray};
  border-radius: 8px;
  background: ${COLORS.white};
`;

export const StyledElearningUnitQuizSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: stretch;
  align-items: stretch;
  padding: 15px;
`;
