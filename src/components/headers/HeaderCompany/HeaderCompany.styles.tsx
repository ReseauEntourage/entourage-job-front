import styled, { css } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledHeaderCompany = styled.div`
  background-color: ${COLORS.white};
`;

export const StyledHeaderCompanyContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 30px;

  @media (man-width: ${BREAKPOINTS.desktop}px) {
    margin-top: 10px;
  }
`;

export const StyledHeaderCompanyPictureContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-right: 50px;
  position: relative;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    margin-right: 20px;
  }
`;

export const StyledHeaderCompanyPicture = styled.div<{ size: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${COLORS.primaryBlue};
  overflow: hidden;
  ${({ size }) => {
    return css`
      width: ${size}px;
      height: ${size}px;
    `;
  }}
`;

export const StyledHeaderCompanyInfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
`;

export const StyledHeaderCompanyPublicInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const StyledHeaderCompanyNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1;
`;

export const StyledHeaderNameAndRole = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  h1,
  h2 {
    margin-right: 16px;
  }
`;
