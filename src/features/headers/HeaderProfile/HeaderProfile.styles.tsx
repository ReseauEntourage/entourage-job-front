import styled, { css } from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledEditPictureIconContainer = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${COLORS.primaryBlue};
  padding: 5px;
  width: 30px;
  height: 30px;
`;

export const StyledHeaderProfile = styled.div`
  background-color: ${COLORS.white};
`;

export const StyledHeaderProfileSectionMobile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const StyledHeaderProfilePictureContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
  position: relative;

  .button-mock-image-input {
    margin-top: 20px;
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    margin-right: 0px;
  }
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
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  gap: 15px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    margin-top: 10px;
  }
`;

export const StyledHeaderProfilePublicInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const StyledHeaderProfileInfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
`;

export const StyledHeaderProfileNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1;
`;

export const StyledHeaderProfileSubinfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledHeaderNameAndRole = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

export const StyledHeaderAvailibilityAndUserActions = styled.div`
  display: flex;
  gap: 10px;
`;
