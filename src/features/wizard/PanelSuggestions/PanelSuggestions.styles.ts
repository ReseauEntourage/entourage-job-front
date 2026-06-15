import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledPanel = styled.div`
  background-color: ${COLORS.white};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledPanelTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${COLORS.black};
  margin: 0;
`;

export const StyledPanelSubtitle = styled.p`
  font-size: 13px;
  color: ${COLORS.darkGray};
  margin: 0;
`;

export const StyledSkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledSuggestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledTeaserIcon = styled.div`
  font-size: 32px;
  text-align: center;
`;
