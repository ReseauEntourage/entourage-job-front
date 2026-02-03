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

export const StyledElearningUnitModalContent = styled.div<{
  noPadding?: boolean;
}>`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: ${(props) => (props.noPadding ? '0' : '16px')};
  gap: 16px;
`;

export const StyledElearningUnitModalVideoFrame = styled.div<{
  maxWidthRatio: number;
}>`
  --maxVideoHeight: 60vh;

  display: flex;
  justify-content: center;

  /*
    La hauteur du player dépend de sa largeur (ratio YouTube).
    En limitant la largeur en fonction d'une hauteur max (vh),
    on garantit que la vidéo « rétrécit » quand la fenêtre est basse.
  */
  .video-inner {
    width: min(
      100%,
      calc(var(--maxVideoHeight) * ${(props) => props.maxWidthRatio})
    );
  }

  @media (max-height: 800px) {
    --maxVideoHeight: 46vh;
  }

  @media (max-height: 700px) {
    --maxVideoHeight: 40vh;
  }

  @media (max-height: 600px) {
    --maxVideoHeight: 34vh;
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
`;

export const StyledElearningUnitModalActions = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  gap: 8px;
`;

export const StyledElearningUnitModalQuizSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: stretch;
  align-items: stretch;
  padding: 15px;
`;
