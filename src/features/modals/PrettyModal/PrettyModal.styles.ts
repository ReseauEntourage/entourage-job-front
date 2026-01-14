import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledModalHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

export const StyledModalHeaderIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 50%;
  background-color: ${COLORS.primaryBlue};
`;

export const StyledModalSeparator = styled.hr`
  width: 100%;
  height: 2px;
  border: none;
  background-color: ${COLORS.gray};
  margin: 16px 0;
`;

export const StyledModalContentContainer = styled.div`
  padding: 0 25px;
`;

export const StyledModalFooterContainer = styled.div`
  margin-top: 24px;
  display: flex;
  // All elements centered horizontally and take as much space as needed
  justify-content: center;
  align-items: center;
`;
