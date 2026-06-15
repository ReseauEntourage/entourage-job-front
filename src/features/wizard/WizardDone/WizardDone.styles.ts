import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  padding: 40px 24px;
`;

export const StyledDoneIcon = styled.div`
  font-size: 64px;
`;

export const StyledDoneTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${COLORS.black};
  margin: 0;
`;

export const StyledDoneSubtitle = styled.p`
  font-size: 16px;
  color: ${COLORS.darkGray};
  margin: 0;
  max-width: 400px;
`;
