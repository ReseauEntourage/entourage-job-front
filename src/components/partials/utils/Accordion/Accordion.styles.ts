import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledAccordion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid ${COLORS.hoverBlue};
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 35px 0;
  width: 100%;
`;

export const StyledAccordionTitle = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const StyledAccordionOpenIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${COLORS.hoverBlue};
  background-color: ${COLORS.white};
  drop-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
