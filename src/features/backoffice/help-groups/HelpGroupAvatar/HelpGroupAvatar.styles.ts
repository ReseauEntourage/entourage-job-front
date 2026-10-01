import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

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
  border: 2px solid ${COLORS.white};
  box-sizing: border-box;
  background-color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? COLORS.gray : COLORS.primaryBlue};
  color: ${COLORS.white};
  font-size: ${({ $size }) => Math.round($size / 2.6)}px;
  text-transform: uppercase;
`;

export const StyledHelpGroupAvatarInitials = styled.span`
  line-height: 1;
`;
