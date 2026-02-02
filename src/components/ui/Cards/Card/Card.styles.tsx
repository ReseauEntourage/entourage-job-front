import styled from 'styled-components';
import { Color, COLORS } from 'src/constants/styles';

export const StyledCard = styled.div<{
  $borderColor?: Color;
  $bgColor: Color;
  $shadow: boolean;
}>`
  display: flex;
  flex: 1;
  flex-direction: column;
  box-shadow: 0 4px 4px 0
    ${({ shadow }) => (shadow ? COLORS.cardShadow : 'transparent')};
  position: relative;
  border-radius: 20px;
  border: 1px solid ${(props) => props.borderColor || COLORS.lightGray};
  background-color: ${(props) => COLORS[props.bgColor]};

  &.mobile {
    width: 100%;
    box-sizing: border-box;
  }
`;

export const StyledCardTopContainer = styled.div<{
  isOpen: boolean;
  isCentered?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22.5px;
  ${({ isOpen }) =>
    isOpen
      ? `
      border-bottom: ${COLORS.gray} solid 1px;
      `
      : ``}
`;

export const StyledCardContent = styled.div`
  padding: 30px 22.5px 20px 22.5px;
  width: 100%;
`;

export const StyledCardTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
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
