import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledImageTitle = styled.section`
  color: white;
  box-sizing: border-box;
  padding: 10px 20% 10px 20px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 15px;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    padding: 60px 45% 60px 50px;
    gap: 20px;
  }
`;

export const StyledImageTitleCTAsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${(props) => (props.marginTop ? '60px' : '0')};
  button:first-child {
    margin-right: 8px;
  }
  button {
    margin-top: 4px;
  }
`;

export const StyledDescription = styled.p`
  line-height: 20px;
  padding-right: 40px;
  margin-top: 16px;
  color: ${(props) => props.color};
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    font-size: 20px;
    line-height: 30px;
  }
`;
