import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCVCTA = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
`;

export const StyledCVCTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  width: 26%;
  min-width: 200px;
  p {
    text-align: center;
    color: ${COLORS.darkGrayFont};
  }
  &.mobile {
    width: 100%;
    margin: 14px 0;
    order: ${(props) => {
      return props.order;
    }};
  }
`;

export const StyledCVShareButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
`;

export const StyledCVShareBUtton = styled.div`
  border: 1px solid ${COLORS.primaryOrange};
  border-radius: 500px;
  display: block;
  padding: 7px;
  svg {
    fill: ${COLORS.primaryOrange};
    height: 25px;
    width: 25px;
  }
  &:hover {
    background-color: ${COLORS.primaryOrange};
    cursor: pointer;
    svg {
      color: white;
      fill: white;
    }
  }
`;
