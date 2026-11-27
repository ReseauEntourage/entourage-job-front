import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export interface StyledSimpleImageTextBackgroundProps {
  $backgroundColor?: 'blue';
}
interface StyledSimpleImageTextContainerProps {
  $reverse: boolean;
}

const backgroundColors: {
  [
    K in NonNullable<StyledSimpleImageTextBackgroundProps['$backgroundColor']>
  ]: string;
} = {
  blue: COLORS.hoverBlue,
};

export const StyledSimpleImageTextBackground = styled.div<StyledSimpleImageTextBackgroundProps>`
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor ? backgroundColors[$backgroundColor] : undefined};
`;

export const StyledSimpleImageTextContainer = styled.div<StyledSimpleImageTextContainerProps>`
  display: flex;
  flex-direction: ${({ $reverse }) => ($reverse ? 'row-reverse' : 'row')};
  align-items: stretch;
  flex-wrap: wrap;
  gap: 5%;
`;

export const StyledSimpleImageTextImageContainer = styled.div`
  width: 45%;
  position: relative;
  min-height: 100%;
  min-height: 500px;
  margin: auto 0;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
    margin-bottom: 20px;
    min-height: 250px;
  }

  img {
    border-radius: 40px;
  }
`;

export const StyledSimpleImageTextTextContainer = styled.div<{
  $contentPaddingY?: number;
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 30px;
  width: 100%;
  padding: ${(props) => props.$contentPaddingY}px 0;
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    width: 50%;
  }
`;

export const StyledTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
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
    overflow: hidden;
    .playBtnCustom {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${COLORS.primaryBlue};
      background-repeat: no-repeat;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.5 5.5v13l11-6.5z" fill="white"/></svg>');
      background-size: 70%;
      background-position: center;
      filter: none;
      opacity: 1;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
      transition:
        transform 0.2s ease,
        background-color 0.2s ease,
        box-shadow 0.2s ease;
    }
    &:hover {
      .playBtnCustom {
        background-color: ${COLORS.blueShade3};
        cursor: pointer;
        transform: translate3d(-50%, -50%, 0) scale(1.1);
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.28);
      }
    }
    &.lyt-activated {
      .playBtnCustom {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .playBtnCustom {
        transition: none;
      }
    }
  }
`;

export const StyledCTAsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  button:first-child {
    margin-right: 20px;
  }
  button {
    margin-top: 4px;
  }
  margin-top: 30px;
`;
