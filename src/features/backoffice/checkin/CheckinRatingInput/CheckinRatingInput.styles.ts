import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledCheckinRatingInput = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  background: ${COLORS.lightGray};
  border-radius: 16px;
`;

export const StyledCheckinRatingStar = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
`;
