import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledEntreprisesActionItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${COLORS.hoverBlue};
  border-radius: 40px;
  align-items: center;
  padding: 20px;
`;

export const StyledEntreprisesActionItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
`;
