import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

export const StyledSimpleCardsImageCTAContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: 1fr 1fr;
    gap: 10%;
  }
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: stretch;
  width: 100%;
  margin: 60px 0;
`;

export const StyledSimpleCardsImageCTASubtitle = styled.div`
  width: 100%;
  text-align: center;
`;

export const StyledSimpleCardsImageCTACard = styled.div`
  border-radius: 40px;
  background-color: ${COLORS.hoverBlue};
  display: flex;
  flex-direction: column;

  .image-container {
    position: relative;
    height: 320px;

    img {
      border-radius: 40px 40px 0 0;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px;
    gap: 30px;
    .text-container {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
  }

  &.mobile {
    width: 100%;
    margin-bottom: 40px;
  }
`;

export const StyledCriteriasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 23px;
`;

export const StyledCriteria = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;
