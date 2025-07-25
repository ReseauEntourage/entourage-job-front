import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfileCompletion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledProgressionContainer = styled.div`
  display: flex;
  background: ${COLORS.lightGray};
  border-radius: 20px;
  height: 9px;
`;

export const StyledProgression = styled.div<{ completionRate: number }>`
  // Background is a gradient of green and blue
  background: linear-gradient(
    to right,
    ${COLORS.lightGreen} 0%,
    ${COLORS.green} 100%
  );
  opacity: 0.6;
  border-radius: 20px;
  height: 100%;
  width: ${({ completionRate }) => completionRate}%;
`;
