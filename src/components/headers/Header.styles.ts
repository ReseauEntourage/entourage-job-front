import styled from 'styled-components';
import { HEIGHTS } from 'src/constants/styles';

export const StyledHeaderDesktop = styled.header`
  height: ${HEIGHTS.HEADER}px;
`;

export const StyledHeaderMobile = styled.header`
  height: ${HEIGHTS.HEADER_MOBILE}px;
`;

export const StyledMessagingIconContainer = styled.div`
  position: relative;
  margin-right: 10px;

  .pin-notification {
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: 16px;
    background: red;
    border-radius: 50%;
  }
`;
