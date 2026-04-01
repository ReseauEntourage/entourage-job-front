import styled from 'styled-components';
import { COLORS, HEIGHTS } from 'src/constants/styles';

export const StyledNavContainerDesktop = styled.header`
  height: ${HEIGHTS.HEADER}px;
`;

export const StyledNavContainerMobile = styled.header`
  height: ${HEIGHTS.HEADER_MOBILE}px;
`;

export const StyledMessagingIconContainer = styled.div`
  position: relative;
  margin-right: 10px;

  .pin-notification {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 16px;
    height: 16px;
    background: ${COLORS.lightRed};
    border-radius: 50%;
  }
`;
