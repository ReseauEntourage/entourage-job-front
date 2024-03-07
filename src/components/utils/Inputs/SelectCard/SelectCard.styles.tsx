import styled from 'styled-components';
import { commonInputContainerStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledSelectCardContainer = styled.div`
  ${() => commonInputContainerStyles}
`;
export const StyledSelectCard = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  padding: 0;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 40px;

  > li {
    list-style: none;
    width: 270px;
    display: flex;

    > button {
      flex: 1;
      display: flex;
      width: 100%;
      border: 2px solid #ffeadc;
      background-color: #ffffff;
      border-radius: 20px;
      padding: 11px 1px;

      &:hover {
        cursor: pointer;
      }
    }

    &.selected {
      > button {
        padding: 10px 0px;
        border: 3px solid #f55f24;
        background-color: #fef8f5;
      }

      position: relative;
    }
  }
`;

export const StyledCheckIconContainer = styled.div`
  display: none;

  &.selected {
    position: absolute;
    right: -8px;
    top: -8px;
    background-color: ${COLORS.primaryOrange};
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 25px;

    svg {
      color: white;
      height: 19px;
      width: 19px;
    }
  }
`;

export const StyledSelectCardOption = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  font-family: Poppins, sans-serif;
  padding: 16px;
  text-align: left;
`;

export const StyledSelectCardContent = styled.div`
  position: relative;
`;

export const StyledSelectBlurableSection = styled.div<{
  shouldBlur: boolean;
}>`
  ${({ shouldBlur }) => shouldBlur && 'filter: blur(2px);'}
`;
export const StyledSelectCardDisabledOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  background-color: ${COLORS.hoverOrange};
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  top: -10px;
  left: 0;
  bottom: -10px;
  right: 0;
  white-space: pre-line;
  > svg {
    margin-bottom: 16px;
  }
`;

export const StyledSelectCardBulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0;
`;

export const StyledSelectCardBullet = styled.li`
  display: flex;
  align-items: center;

  :not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const StyledSelectCardBulletIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  width: 20px;
`;
