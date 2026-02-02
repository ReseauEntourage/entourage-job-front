import styled from 'styled-components';
import { COLORS, HEIGHTS } from 'src/constants/styles';

export const StyledBackofficeBackground = styled.div`
  background-color: ${COLORS.lightGray};
  min-height: calc(100vh - ${HEIGHTS.HEADER}px);
`;

export const StyledBackofficeGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
  width: 100%;

  &.mobile {
    flex-direction: column;
    gap: 0;
  }
`;

export const StyledNoResult = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-style: italic;
  color: ${COLORS.mediumGray};
  margin-top: 16px;
`;
