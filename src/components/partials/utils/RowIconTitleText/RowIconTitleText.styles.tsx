import styled from 'styled-components';
import { Color, COLORS } from 'src/constants/styles';

export const StyledSectionContent = styled.div`
  background: ${({ bgColor }) => COLORS[bgColor]};
  border-radius: 30px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export interface StyledRowIconTitleTextBackgroundProps {
  backgroundColor: Color;
}

export const StyledRowIconTitleTextBackground = styled.div<StyledRowIconTitleTextBackgroundProps>`
  background-color: ${({ backgroundColor }) => COLORS[backgroundColor]};
`;

export const StyledRowIconTitleTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: space-between;
  gap: 20px;
`;

export const StyledIconTitleTextItem = styled.div`
  width: 20%;
  box-sizing: border-box;
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  > .image-container {
    position: relative;
  }
  &.mobile {
    width: 100%;
    > .image-container {
      position: relative;
    }
  }
`;
