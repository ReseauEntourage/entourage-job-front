import { styled } from 'styled-components';
import { ButtonIcon } from '@/src/components/ui/Button';
import { COLORS } from '@/src/constants/styles';

// Below this width of the block's own container, the text and the button stack
export const DONATION_BLOCK_STACKED_MAX_WIDTH = 560;

// Touch area of the button and of the cross
const MIN_TOUCH_SIZE = 44;

export const StyledDonationBlockContainer = styled.div`
  position: relative;
  width: 100%;
  container-type: inline-size;
`;

export const StyledDonationBlockLayout = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  /* Keeps the text away from the cross */
  padding-right: ${MIN_TOUCH_SIZE}px;

  @container (max-width: ${DONATION_BLOCK_STACKED_MAX_WIDTH - 1}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const StyledDonationBlockIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${COLORS.extraLightOrange};
`;

export const StyledDonationBlockText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
`;

export const StyledDonationBlockAction = styled.div`
  flex-shrink: 0;

  button {
    min-height: ${MIN_TOUCH_SIZE}px;
  }
`;

export const StyledDonationBlockClose = styled(ButtonIcon)`
  position: absolute;
  top: 0;
  right: 0;
  min-width: ${MIN_TOUCH_SIZE}px;
  min-height: ${MIN_TOUCH_SIZE}px;
`;
