import { styled } from 'styled-components';
import { ButtonIcon } from '@/src/components/ui/Button/ButtonIcon';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

// Minimum touch target of every clickable control of the mobile header
const MOBILE_TOUCH_TARGET = '44px';

/**
 * Icon button of the conversation header. On mobile it gets a 44 x 44 px touch
 * target and a light background while hovered or when the menu it opens is
 * shown. Desktop keeps the plain `ButtonIcon`.
 */
export const HeaderIconButton = styled(ButtonIcon)`
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    && {
      flex-shrink: 0;
      justify-content: center;
      min-width: ${MOBILE_TOUCH_TARGET};
      min-height: ${MOBILE_TOUCH_TARGET};
    }

    &&:hover,
    &&[aria-expanded='true'] {
      background-color: ${COLORS.hoverBlue};
    }
  }
`;

export const MessagingConversationHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 21px;
  border-bottom: 1px solid ${COLORS.lightGray};
  background: ${COLORS.white};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    border-bottom: 1px solid ${COLORS.gray};
    background: ${COLORS.lightGray};
    align-items: stretch;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 0;
  }
`;

export const MessagingConversationHeaderMainInfos = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 14px;
  align-items: center;
  gap: 12px;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 6px;
    padding: 5px 4px;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  /* Lets the name shrink instead of pushing the controls out of the screen */
  min-width: 0;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 6px;
  }
  * {
    margin: 0;
  }
`;

export const AddreseeSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const AddreseeInfosContainer = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
  align-items: center;
  min-width: 0;
  /* The avatar never shrinks: only the name is truncated */
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    & > :first-child {
      flex-shrink: 0;
    }
  }
`;

export const ConversationAddresee = styled.div`
  display: flex;
  align-items: flex-start;
  flex: auto;
  flex-direction: column;
  min-width: 0;
`;

// On a single line, a name that is too long ends with an ellipsis
export const AddreseeName = styled.div`
  min-width: 0;
  max-width: 100%;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    & > * {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const AddreseeBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-shrink: 0;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 6px;
  }
`;

export const DropdownItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
