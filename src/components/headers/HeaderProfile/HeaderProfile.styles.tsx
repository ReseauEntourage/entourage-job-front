import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfilePlaceholder = styled.a`
  color: ${COLORS.primaryBlue};
  text-decoration: underline;
  font-style: italic;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

export const StyledEditPictureIconContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${COLORS.primaryBlue};
  padding: 5px;
`;

export const StyledHeaderProfile = styled.div`
  background-color: ${COLORS.white};
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
`;

export const StyledHeaderProfilePictureContainerMobile = styled(
  StyledHeaderProfilePictureContainer
)`
  margin-right: 10px;
`;

export const StyledHeaderProfilePicture = styled.div<{ size: number }>`
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

export const StyledHeaderProfileContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const StyledHeaderProfileInfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  h1,
  h2,
  h3,
  h5,
  h6 {
    margin-bottom: 0;
    margin-top: 0;
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
  margin-bottom: 20px;

  h1,
  h2 {
    margin-right: 16px;
  }
`;

export const StyledHeaderNameAndRoleMobile = styled(StyledHeaderNameAndRole)`
  margin-bottom: 10px;
`;

export const StyledHeaderProfileDescription = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const StyledHeaderProfileCVButton = styled.div`
  margin-top: 12px;
`;
