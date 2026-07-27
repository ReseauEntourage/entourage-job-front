import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledRecapSuggestedMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: 100%;
`;

export const StyledRecapSuggestedMessageInputContainer = styled.div`
  display: flex;
  background: ${COLORS.white};
  padding: 13px 20px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 16px;
  border: 1px solid ${COLORS.lightGray};
`;
