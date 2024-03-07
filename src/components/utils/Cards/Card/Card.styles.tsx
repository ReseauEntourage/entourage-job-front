import styled from 'styled-components';
import { StyledCardCommon } from '../Cards.styles';
import { COLORS } from 'src/constants/styles';

export const StyledCard = styled(StyledCardCommon)`
  border-radius: 20px;
  border: 1px solid ${COLORS.lightgray};

  &.mobile {
    width: 100%;
    box-sizing: border-box;
  }
`;

export const StyledCardTopContainer = styled.div`
  padding-top: 25px;
`;

export const StyledCardContent = styled.div`
  padding: 25px;
`;

export const StyledCardTitleContainer = styled.div`
  /* border-bottom: ${COLORS.hoverBlue} solid 1px; */
  border-bottom: ${COLORS.lightgray} solid 1px;
  margin-right: 25px;
  margin-left: 25px;
  padding-bottom: 25px;
  margin-bottom: 0;

  h5 {
    margin-bottom: 0;
  }

  &.no-border {
    border-bottom: none;
    margin-bottom: 0;

    > h5 {
      margin-bottom: 0;
    }
  }
`;

export const StyledEditIconContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  display: flex;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: ${COLORS.primaryBlue} 1px solid;
  transition: 0.3s ease-in-out;
  :hover {
    background-color: ${COLORS.hoverBlue};
  }
`;

export const StyledSpinnerContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
`;

export const StyledChevronContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: ${COLORS.primaryBlue};
    height: 19px;
    width: 19px;
  }
`;

export const StyledCardFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
`;
