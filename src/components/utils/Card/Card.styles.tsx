import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCard = styled.div`
  background-color: #fff;
  box-shadow: 0px 4px 4px 0px ${COLORS.lightgray};
  border-radius: 10px;
  position: relative;
  border: 1px solid ${COLORS.lightgray};

  &.mobile {
    width: 100%;
    box-sizing: border-box;
  }

  ${({ onClick }) =>
    onClick
      ? css`
          cursor: pointer;
          transition: box-shadow 0.2s ease-in-out;

          &:hover {
            box-shadow: 0px 8px 8px 0px ${COLORS.gray};
          }
        `
      : ''}
`;

export const StyledCardTopContainer = styled.div`
  padding-top: 25px;
`;

export const StyledCardContent = styled.div`
  padding: 25px;
`;

export const StyledCardTitleContainer = styled.div`
  border-bottom: ${COLORS.hoverOrange} solid 1px;
  margin-right: 25px;
  margin-left: 25px;
  padding-bottom: 25px;
  margin-bottom: 0px;

  h5 {
    margin-bottom: 0px;
  }

  &.no-border {
    border-bottom: none;
    margin-bottom: 0px;

    > h5 {
      margin-bottom: 0px;
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
  border: ${COLORS.primaryOrange} 1px solid;
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
    color: ${COLORS.primaryOrange};
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
