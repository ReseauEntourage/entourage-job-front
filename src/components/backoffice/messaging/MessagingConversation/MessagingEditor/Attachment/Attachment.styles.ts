import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledChip = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: ${COLORS.white};
`;

export const StyledButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
