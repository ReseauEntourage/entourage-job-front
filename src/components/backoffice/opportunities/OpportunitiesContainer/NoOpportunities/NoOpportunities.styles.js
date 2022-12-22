import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  & .uk-button {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
`;

export const StyledTitle = styled.h4`
  color: ${COLORS.darkGray};
  margin: 0;
`;

export const StyledDescription = styled.p`
  margin-bottom: 40px;
`;
