import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledVerifyEmailSuccessDiv = styled.div`
  color: ${COLORS.yesGreen};
`;

export const StyledVerifyEmailErrorDiv = styled.div`
  color: ${COLORS.noRed};
  display: flex;
  padding: 10px;
  border: 1px solid ${COLORS.noRed};
  border-radius: 10px;
`;
