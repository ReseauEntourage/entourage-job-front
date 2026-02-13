import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

const StyledContainer = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${COLORS.lightGray};
  border-radius: 6px;
  overflow: hidden;
`;

const StyledFill = styled.div<{ color: string; width?: string }>`
  height: 100%;
  background-color: ${(props) => COLORS[props.color] || COLORS.primaryBlue};
  width: ${(props) => props.width || '0%'};
  transition: width 0.3s ease-in-out;
`;

export const StyledProgressBar = {
  Container: StyledContainer,
  Fill: StyledFill,
};
