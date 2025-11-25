import styled from 'styled-components';

export const StyledImgContainer = styled.div<{ size: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ bgColor }) => bgColor};
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  border-radius: 16px;
`;
