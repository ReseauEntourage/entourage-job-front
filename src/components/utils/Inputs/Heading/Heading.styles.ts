import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledFormHeading = styled.div`
  width: 100%;
  font-size: ${({ isMobile }) => {
    return isMobile ? 14 : 16;
  }}px;
  margin: 28px 0 24px;
  padding-bottom: 4px;
  border-bottom: 1px solid ${COLORS.primaryOrange};
`;
