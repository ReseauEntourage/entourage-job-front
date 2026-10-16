import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const AVATAR_RING_WIDTH = 2;

export const StyledHelpGroupAvatar = styled.div<{
  $size: number;
  $isPlaceholder: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  overflow: hidden;
  border: ${AVATAR_RING_WIDTH}px solid ${COLORS.white};
  box-sizing: border-box;
  background-color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? COLORS.gray : COLORS.white};
`;
