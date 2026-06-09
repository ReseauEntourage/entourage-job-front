import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledPageWrapper = styled.div`
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  justify-content: center;
  padding: 80px 16px;
  background-image: url('/static/img/bg-ep-abstract.jpg');
  background-size: cover;
  background-position: center;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 24px 16px;
  }
`;

export const StyledCertificateCard = styled.div`
  background-color: ${COLORS.white};
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 56px 64px 48px;
  max-width: 760px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 40px 24px 36px;
  }
`;

export const StyledBadgeWrapper = styled.div`
  margin-top: -100px;
  margin-bottom: 8px;
`;

export const StyledDivider = styled.hr`
  width: 60px;
  border: none;
  border-top: 2px solid ${COLORS.gray};
  margin: 8px 0;
`;

export const StyledLogoWrapper = styled.div`
  margin-top: 8px;
`;
