import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledMobileStickyBanner = styled.div<{ isVisible: boolean }>`
  display: none;

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: ${COLORS.primaryBlue};
    color: ${COLORS.white};
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
    transition: opacity 0.2s ease;
    pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
  }
`;

export const StyledBannerText = styled.span`
  flex: 1;
`;

export const StyledBannerCount = styled.span`
  background: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 2px 8px;
  font-weight: 700;
`;
