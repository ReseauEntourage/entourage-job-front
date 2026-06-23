import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 24px;
  gap: 16px;
`;

export const StyledEmoji = styled.span`
  font-size: 48px;
  line-height: 1;
`;

export const StyledCount = styled.span`
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  color: ${COLORS.primaryBlue};
`;

export const StyledTitle = styled.p`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  max-width: 340px;
`;

export const StyledAvatarRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0;
`;

export const StyledAvatarItem = styled.div<{ $index: number }>`
  border-radius: 50%;
  border: 3px solid white;
  margin-left: ${({ $index }) => ($index === 0 ? '0' : '-12px')};
  position: relative;
  z-index: ${({ $index }) => 10 - $index};
  flex-shrink: 0;
`;

export const StyledAvatarSkeleton = styled.div<{ $index: number }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: ${COLORS.lightGray};
  border: 3px solid white;
  margin-left: ${({ $index }) => ($index === 0 ? '0' : '-12px')};
  position: relative;
  z-index: ${({ $index }) => 10 - $index};
  flex-shrink: 0;
`;

export const StyledSubtitle = styled.p`
  font-size: 14px;
  color: ${COLORS.darkGray};
  margin: 0;
  max-width: 280px;
  line-height: 1.5;
`;
