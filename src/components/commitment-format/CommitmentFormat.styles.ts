import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const CommitmentFormatTitle = styled.h1`
  font-weight: 700;
  margin-bottom: 16px;
  color: ${COLORS.darkBlue};
`;

export const CommitmentFormatIntro = styled.p`
  color: ${COLORS.darkGray};
  margin-bottom: 32px;
`;

export const CommitmentFormatCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 40px;
  width: 100%;
`;

export const CommitmentFormatCardContainer = styled.div`
  background: ${COLORS.white};
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: row;
  position: relative;
`;

export const CommitmentFormatCardImg = styled.div`
  height: 200px;
  background: ${COLORS.lightGray};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    object-fit: contain;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    display: block;
    width: 320px;
    height: 240px;
  }
`;

export const CommitmentFormatCardContent = styled.div`
  padding: 20px 20px 16px 20px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h3 {
    margin: 0;
  }
`;

export const CommitmentFormatCardInfos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0 8px 0;
  color: ${COLORS.mediumGray};
  flex-wrap: wrap;
`;

export const CommitmentFormatCardDesc = styled.div`
  color: ${COLORS.darkGray};
`;

export const CommitmentFormatCardPrice = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${COLORS.extraDarkBlue};
  color: ${COLORS.white};
  border-radius: 20px;
  padding: 6px 18px;
`;

export const CommitmentFormatCta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${COLORS.extraDarkBlue};
  color: ${COLORS.white};
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
`;
export const CommitmentFormatCtaBtn = styled.button`
  margin-top: 18px;
  background: ${COLORS.extraDarkBlue};
  color: ${COLORS.white};
  border: 1px solid ${COLORS.white};
  border-radius: 20px;
  padding: 10px 28px;
`;
