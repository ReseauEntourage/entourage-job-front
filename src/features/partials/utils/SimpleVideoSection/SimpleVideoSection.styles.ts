import { styled } from 'styled-components';

export const StyledVideoContainer = styled.div<{ $borderRadius: number }>`
  overflow: hidden;
  border-radius: ${(props) => props.$borderRadius}px;
`;
