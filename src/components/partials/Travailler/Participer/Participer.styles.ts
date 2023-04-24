import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledParticiper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 92px;
  .image-container {
    width: 40%;
    position: relative;
    img {
      border-radius: 20px;
      height: 100%;
    }
  }
  .text-container {
    width: 60%;
    box-sizing: border-box;
    padding: 0 0 0 42px;
    ul {
      padding-left: 0;
    }
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop - 1}px) {
    margin-top: 32px;
    .text-container {
      width: 100%;
      padding-left: 0;
    }
    .image-container-mobile {
      width: 100%;
      position: relative;
      height: 60vh;
      margin: 28px 0;
      img {
        border-radius: 20px;
      }
    }
  }
`;
