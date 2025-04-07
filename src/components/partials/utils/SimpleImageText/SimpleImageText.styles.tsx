import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

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
  align-items: stretch;
  flex-wrap: wrap;
  gap: 5%;
  min-height: 400px;
`;

export const StyledSimpleImageTextImageContainer = styled.div`
  width: 45%;
  position: relative;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
    margin-bottom: 20px;
    height: 340px;
  }

  img {
    border-radius: 40px;
  }
`;

export const StyledSimpleImageTextTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 30px;
  width: 100%;
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    width: 50%;
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

export const StyledCTAsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${(props) => (props.marginTop ? '60px' : '0')};
  button:first-child {
    margin-right: 20px;
  }
  button {
    margin-top: 4px;
  }
`;
