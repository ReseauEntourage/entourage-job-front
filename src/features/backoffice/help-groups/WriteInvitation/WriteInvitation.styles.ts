import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledWriteInvitation = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 20px;
  background-color: ${COLORS.hoverBlue};
`;
