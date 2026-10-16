import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledNotificationsList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledNotificationsListItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const StyledNotificationItem = styled.li<{ $isSeen: boolean }>`
  border-bottom: 1px solid ${COLORS.gray};
  background-color: ${({ $isSeen }) =>
    $isSeen ? COLORS.white : COLORS.hoverBlue};

  a {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    color: ${COLORS.black};
    text-decoration: none;
  }

  a:hover {
    background-color: ${COLORS.extraLightGray};
  }
`;

export const StyledNotificationItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  overflow-wrap: anywhere;
`;

export const StyledUnseenDot = styled.span<{ $isSeen: boolean }>`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background-color: ${({ $isSeen }) =>
    $isSeen ? COLORS.transparent : COLORS.primaryBlue};
`;

export const StyledNotificationsListFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 16px;
`;
