import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledElearningUnitModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

export const StyledElearningUnitModalHeader = styled.div`
  padding: 16px;
`;

export const StyledElearningUnitModalBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const StyledElearningUnitModalContent = styled.div<{
  noPadding?: boolean;
}>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: ${(props) => (props.noPadding ? '0' : '16px')};
  gap: 16px;
`;

export const StyledElearningUnitModalVideoFrame = styled.div<{
  maxWidthRatio: number;
}>`
  display: flex;
  flex: 1;
  min-height: 0;
  justify-content: center;
  align-items: center;
  padding: 16px;

  /* Permet d'utiliser cqh (container query height units) */
  container-type: size;

  /*
    La hauteur du player dépend de sa largeur (ratio YouTube).
    En limitant la largeur en fonction d'une hauteur max (vh),
    on garantit que la vidéo « rétrécit » quand la fenêtre est basse.
  */
  .video-inner {
    width: 100%;
    max-width: 100%;
  }

  /*
    Le player react-lite-youtube-embed est dimensionné par la largeur.
    Ici on calcule une largeur maximale à partir de la HAUTEUR disponible du container,
    afin de faire grandir la vidéo jusqu'à remplir l'espace restant.
  */
  @supports (width: 1cqh) {
    .video-inner {
      width: min(100%, calc(100cqh * ${(props) => props.maxWidthRatio}));
    }
  }
`;

export const StyledQuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledElearningQuestionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 16px 0 16px;
  margin-top: 16px;
  border: 2px solid ${COLORS.gray};
  border-radius: 8px;
`;

export const StyledInviteToGoToQuiz = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  padding: 10px 15px;
  background-color: ${COLORS.hoverBlue};
  flex-shrink: 0;
`;

export const StyledElearningUnitModalActions = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  gap: 8px;
  flex-shrink: 0;
`;

export const StyledElearningUnitModalQuizSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: stretch;
  align-items: stretch;
  padding: 15px;
`;
