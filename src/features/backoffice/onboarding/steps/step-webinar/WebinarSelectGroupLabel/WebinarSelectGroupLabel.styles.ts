import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledWebinarSelectGroupLabel = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const StyledLine = styled.div`
  flex-grow: 1;
  height: 1px;
  background-color: ${COLORS.gray};
  margin-left: 8px;
`;
