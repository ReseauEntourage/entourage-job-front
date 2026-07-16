import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCountRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

export const StyledLockBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${COLORS.hoverBlue};
  border-radius: 8px;
`;

export const StyledPanelContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledProfileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledCompactContent = styled.div`
  padding: 12px 16px;
`;
