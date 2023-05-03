import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledPartners = styled.div`
  padding: 40px 0;
  border-bottom: 0.5px solid ${COLORS};
  .logos-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    margin: 40px 0 40px;
    @media screen and (max-width: ${BREAKPOINTS.desktop - 1}px) {
      margin: 20px 0 20px;
    }
    > div {
      margin: 0 30px;
      margin-bottom: 20px;
      position: relative;
      display: flex;
      justify-content: center;
      img {
        max-height: 70px;
        height: 100%;
      }
      @media screen and (max-width: ${BREAKPOINTS.desktop - 1}px) {
        width: 100%;
        margin-bottom: 30px;
        img {
          max-height: 50px;
        }
      }
    }
  }
`;
