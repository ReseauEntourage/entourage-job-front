import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  padding: 8px 16px;
  width: fit-content;
  background: ${COLORS.extraDarkBlue};
`;
