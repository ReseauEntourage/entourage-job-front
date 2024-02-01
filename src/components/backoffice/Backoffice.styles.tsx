import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledBackofficeBackground = styled.div`
  background-color: ${COLORS.lightgray};
`;

export const StyledBackofficeGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
  width: 100%;
  &.mobile {
    margin-top: 30px;
    flex-direction: column;
    gap: 0;
  }
`;

export const StyledHeaderProfile = styled.div`
  min-height: 275px;
  background-color: white;

  &.mobile {
    min-height: unset;
  }
`;

export const StyledHeaderProfilePictureContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-right: 50px;
  position: relative;
  .button-mock-image-input {
    margin-top: 20px;
  }

  &.mobile {
    margin-right: 10px;
  }
`;

export const StyledHeaderProfilePicture = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 146px;
  height: 146px;
  border-radius: 50%;
  background-color: ${COLORS.primaryOrange};
  overflow: hidden;
  ${({ size }) => {
    return css`
      width: ${size}px;
      height: ${size}px;
    `;
  }}
`;

export const StyledHeaderProfileContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const StyledMobileHeaderProfileTitlesContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  h6 {
    margin-top: 0;
  }

  h2,
  h5,
  h6 {
    margin-bottom: 0;
  }
`;

export const StyledHeaderProfileTextContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  h1,
  h5,
  h6 {
    margin-bottom: 0;
  }

  a {
    line-height: 24px;
  }
`;

export const StyledHeaderProfileNameContainer = styled.div`
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
  margin-bottom: ${({ isDesktop }) => (isDesktop ? 20 : 10)}px;
  h1,
  h2 {
    margin-right: 16px;
  }
`;

export const StyledHeaderProfileDescription = styled.div`
  margin-top: 20px;
  font-style: italic;
  color: ${COLORS.darkGrayFont};
`;

export const StyledNoResult = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-style: italic;
  color: ${COLORS.darkGray};
`;
