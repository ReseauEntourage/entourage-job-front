import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledHeaderParametres = styled.div`
  min-height: 275px;
  background-color: white;

  &.mobile {
    min-height: unset;
  }
`;

export const StyledProfilePictureContainer = styled.div`
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

export const StyledProfilePicture = styled.div`
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

export const StyledHeaderParametresContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  > a {
    line-height: 24px;
    margin-bottom: 20px;
  }
`;

export const StyledMobileTitlesContainer = styled.div`
  display: flex;
  flex-direction: column;

  > h2 {
    margin-bottom: 10px;
  }

  > h6 {
    margin-top: 0px;
  }

  > a {
    line-height: 14px;
    margin-bottom: 24px;
  }
`;

export const StyledEditPictureIconContainer = styled.div`
  position: absolute;
  ${({ isMobile }) => {
    return css`
      bottom: ${isMobile ? 0 : '5%'};
      right: ${isMobile ? 0 : '5%'};
    `;
  }}
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${COLORS.primaryOrange};
  padding: 5px;
`;

export const StyledParametresPlaceholder = styled.a`
  color: ${COLORS.primaryOrange};
  text-decoration: underline;
  font-style: italic;
  &:hover {
    text-decoration: underline;
  }
`;
