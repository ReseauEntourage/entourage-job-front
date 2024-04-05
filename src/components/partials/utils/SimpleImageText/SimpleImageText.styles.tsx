import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export interface StyledSimpleImageTextBackgroundProps {
  backgroundColor: 'blue';
}
export interface StyledSimpleImageTextContainerProps {
  reverse: boolean;
}

const backgroundColors: {
  [K in NonNullable<
    StyledSimpleImageTextBackgroundProps['backgroundColor']
  >]: string;
} = {
  blue: COLORS.hoverBlue,
};

export const StyledSimpleImageTextBackground = styled.div<StyledSimpleImageTextBackgroundProps>`
  background-color: ${({ backgroundColor }) =>
    backgroundColors[backgroundColor]};
`;

export const StyledSimpleImageTextContainer = styled.div<StyledSimpleImageTextContainerProps>`
  display: flex;
  flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
  flex-wrap: wrap;
  gap: 10%;
  min-height: 400px;
`;

export const StyledSimpleImageTextImageContainer = styled.div`
  width: 40%;
  position: relative;

  img {
    border-radius: 40px;
  }
  &.mobile {
    width: 100%;
    margin-bottom: 20px;
    height: 340px;
  }
`;

export const StyledSimpleImageTextTextContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  &.mobile {
    width: 100%;
  }
`;

export const StyledSimpleVideoTextTextContainer = styled(
  StyledSimpleImageTextTextContainer
)`
  width: 40%;
`;

export const StyledSimpleVideoTextVideoContainer = styled(
  StyledSimpleImageTextImageContainer
)`
  width: 50%;
  .videoCustom {
    border-radius: 40px;
    .playBtnCustom {
      background-color: ${COLORS.primaryBlue};
      opacity: 1;
      height: 60px;
      width: 60px;
      border-radius: 50px;
    }
    &:hover {
      .playBtnCustom {
        background-color: ${COLORS.blueShade3};
        cursor: pointer;
      }
    }
    &.lyt-activated {
      .playBtnCustom {
        opacity: 0;
      }
    }
  }
`;
