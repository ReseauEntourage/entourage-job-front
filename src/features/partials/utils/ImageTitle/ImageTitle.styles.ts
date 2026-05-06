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
    padding: 60px 50% 60px 50px;
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
