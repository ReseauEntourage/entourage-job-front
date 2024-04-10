import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledFiguresContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  gap: 50px;
  box-shadow: 0px 4px 40px 0px #97979721;
  border-radius: 100px;
  margin-top: 140px;
  margin-bottom: 40px;
`;

export const StyledFiguresSubtitle = styled.div`
  width: 100%;
  text-align: center;
`;

export const StyledFigure = styled.div`
  transform: translateY(-60px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledFigureNumber = styled.div`
  font-size: 48px;
  color: ${COLORS.primaryBlue};
  font-weight: normal;
  margin: 20px 0;
`;

export const StyledFigureMobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  margin-top: 50px;
`;

export const StyledMobileFigure = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
