import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledImgProfileContainer = styled.div<{
  size: NumberConstructor;
  hightlight: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  ${({ highlight }) => highlight && `border: 2px solid ${COLORS.primaryBlue};`}

  box-sizing: border-box;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
`;
