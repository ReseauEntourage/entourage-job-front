import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledImgProfileContainer = styled.div<{
  size: NumberConstructor;
  hightlight: boolean;
  bgColor: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  ${({ highlight }) => highlight && `border: 2px solid ${COLORS.primaryBlue};`}
  background-color: ${({ bgColor }) => bgColor};

  box-sizing: border-box;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
`;
