import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledTabsContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 15px;
  border-bottom: 2px solid ${COLORS.lightGray};
  flex-shrink: 0;
`;
