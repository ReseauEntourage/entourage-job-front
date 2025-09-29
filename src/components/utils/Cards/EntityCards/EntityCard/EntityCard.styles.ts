import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledEntityCard = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid ${COLORS.gray};
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;
  box-sizing: border-box;
  &:hover {
    box-shadow: 0 8px 16px 0 ${COLORS.gray};
  }
`;
