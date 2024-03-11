import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export interface StyledSimpleImageTextBackgroundProps {
    backgroundColor: "blue";
}


const backroundColors: { [K in NonNullable<StyledSimpleImageTextBackgroundProps['backgroundColor']>]: string } = {
    blue: COLORS.hoverBlue,
};
  

export const StyledSimpleImageTextBackground = styled.div<StyledSimpleImageTextBackgroundProps>`
    background-color: ${({ color }) => backroundColors[color]};
`;

export const StyledSimpleImageTextContainer = styled.div`
     display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10%;

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
    &.mobile {
        width: 100%;
    }
`;