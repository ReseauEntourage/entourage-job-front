import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`;

export const StyledTitleContainer = styled.div`
  flex: 1;
  flex-direction: column;
  border-bottom: 1px ${COLORS.primaryOrange} solid;
`;

export const StyledContentContainer = styled.div`
  margin-top: 12px;
`;
