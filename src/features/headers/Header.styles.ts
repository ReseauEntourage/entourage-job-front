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
    top: 2px;
    right: 2px;
    min-width: 18px;
    height: 18px;
    padding: 0 3px;
    background: ${COLORS.lightRed};
    border-radius: 8px;
    color: white;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
