import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledModerationModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
`;

export const StyledRevisions = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
`;

export const StyledRevision = styled.li`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  border: 1px solid ${COLORS.gray};
  border-radius: 12px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;

export const StyledModerationToast = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-radius: 16px;
  background-color: ${COLORS.extraDarkGray};
  color: ${COLORS.white};
  transform: translateX(-50%);
`;
