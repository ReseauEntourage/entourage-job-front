import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledProfileSubHeader = styled.div`
  display: flex;
  gap: 30px;
  justify-content: space-between;
`;

export const StyledAccordionHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledAccordionHeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: ${COLORS.primaryBlue};
  margin-right: 15px;
`;

export const StyledAccordionHeaderTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
