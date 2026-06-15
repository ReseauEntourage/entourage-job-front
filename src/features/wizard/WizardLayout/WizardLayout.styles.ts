import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from 'src/constants/styles';

export const StyledWizardPage = styled.div`
  min-height: 100vh;
  background-color: ${COLORS.lightGray};
  display: flex;
  flex-direction: column;
`;

export const StyledWizardHeader = styled.header`
  height: ${HEIGHTS.HEADER}px;
  background-color: ${COLORS.white};
  border-bottom: 1px solid ${COLORS.gray};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    padding: 0 16px;
  }
`;

export const StyledWizardHeaderLogo = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${COLORS.primaryBlue};
`;

export const StyledWizardHeaderLink = styled.span`
  font-size: 14px;
`;

export const StyledWizardBody = styled.div`
  flex: 1;
  display: flex;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  gap: 0;
  padding: 40px 40px;

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    flex-direction: column;
    padding: 24px 16px;
  }
`;

export const StyledWizardMain = styled.main`
  flex: 0 0 65%;
  background-color: ${COLORS.white};
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    flex: unset;
    padding: 24px 16px;
    border-radius: 8px;
  }
`;

export const StyledWizardPanel = styled.aside`
  flex: 0 0 35%;
  padding-left: 24px;
  display: flex;
  flex-direction: column;

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    display: none;
  }
`;
