import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledImageTitle = styled.section`
  width: 100%;
  color: white;
  box-sizing: border-box;
  padding: 20px 20% 20px 0;
  h1 {
    margin: 0;
    font-size: 24px;
    color: white;
    font-weight: 700;
  }
  p {
    font-size: 14px;
    line-height: 20px;
    padding-right: 40px;
    margin-top: 16px;
  }
  @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
    padding: 40px 55% 40px 40px;
    h1 {
      font-size: 32px;
    }
    p {
      margin-top: 32px;
      font-size: 20px;
      line-height: 30px;
    }
  }
`;
