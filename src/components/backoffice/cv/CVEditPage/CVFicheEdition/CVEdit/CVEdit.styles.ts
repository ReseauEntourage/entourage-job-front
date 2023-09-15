import styled from 'styled-components';

export const StyledEditPicture = styled.div`
  box-sizing: border-box;
  width: 100%;
  flex: auto;
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  position: relative;
  transition: box-shadow 0.1s ease-in-out;
  border-radius: 5px;
  overflow: hidden;
  color: #363636;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

export const StyledPictureMask = styled.div`
  position: absolute;
  left: 39%;
  top: 0;
  width: 200px;
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

  span {
    svg {
      padding: 10px;
      height: 50px;
      width: 50px;
    }
  }
`;
