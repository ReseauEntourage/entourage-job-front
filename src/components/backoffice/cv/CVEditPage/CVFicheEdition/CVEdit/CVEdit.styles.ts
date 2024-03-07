import { COLORS } from 'src/constants/styles';
import styled from 'styled-components';

export const StyledEditPictureContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  position: relative;
  &.mobile {
    height: 270px;
  }
`;

export const StyledEditPicture = styled.div`
  height: 400px;
  width: 270px !important;
  border-radius: 859px 909px 729px 909px;
  background-position: 66% 39%;
  background-size: cover;
  &.mobile {
    width: 190px !important;
    height: 270px;
  }
`;

export const StyledPictureMask = styled.div`
  display: none;
  position: absolute;
  left: calc(50% - 135px);
  top: 0;
  width: 270px;
  height: 100%;
  box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.8);
  border-radius: 859px 909px 729px 909px;
  &.mobile {
    height: 270px;
    top: 15px;
    left: 35%;
    width: 44%;
  }
`;

export const StyledEditPictureButton = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  height: 50px;
  width: 50px;
  background-color: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
  span {
    &:hover {
      cursor: pointer;
    }
    svg {
      &:hover {
        cursor: pointer;
      }
      padding: 10px;
      height: 50px;
      width: 50px;
    }
  }
`;


export const StyledBlueIconContainer = styled.div`
  svg, path {
    fill: ${COLORS.primaryBlue};
  }
`;