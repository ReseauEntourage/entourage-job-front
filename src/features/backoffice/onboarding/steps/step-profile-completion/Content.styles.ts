import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledAccordionHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledAccordionHeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${COLORS.hoverBlue};
  margin-right: 15px;
`;
