import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const CandidatCardStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  background: ${COLORS.white};
  border-radius: 20px;
  overflow: hidden;
  border: 3px solid ${COLORS.lightGray};
`;

export const CandidatCardPictureContainerStyled = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
  height: 245px;
  background: ${COLORS.lightGray};
`;

export const CandidatCardContentStyled = styled.div`
  flex: auto;
  padding: 20px;
  font-size: 13px;
  font-weight: 400;
  color: ${COLORS.darkGray};
  align-items: space-between;
  cursor: pointer;
  h1 {
    color: ${COLORS.black};
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    margin: 0;
  }
`;

export const CandidatCardPictureOverlay = styled.div`
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 1) 100%
  );
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  items-center: end;
  font-weight: 400;
  font-size: 14px;
  padding: 20px;
  box-sizing: border-box;
  gap: 10px;
  > p {
    margin: 0;
    &.name {
      font-size: 25px;
    }
  }
`;

export const CandidateCardBusinessSectorsStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${COLORS.primaryBlue};
  > * {
    margin-top: 10px;
  }
`;
