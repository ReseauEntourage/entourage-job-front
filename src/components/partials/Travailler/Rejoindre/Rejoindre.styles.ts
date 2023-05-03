import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledRejoindre = styled.div`
  display: flex;
  flex-direction: row;
  margin: 62px 0;
  > div {
    width: 50%;
    box-sizing: border-box;
  }
  .text-container {
    background-color: ${COLORS.wheat};
    padding: 48px 60px;
    ul {
      padding-left: 0;
    }
  }
  .image-container {
    position: relative;
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop - 1}px) {
    flex-direction: column;
    margin: 32px 0;
    > div {
      width: 100%;
    }
    .text-container {
      padding: 32px 20px;
    }
    .image-container {
      height: 60vh;
    }
  }
`;
