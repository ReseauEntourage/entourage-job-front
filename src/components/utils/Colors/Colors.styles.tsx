import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledColorsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: start;
`;

export const StyledColorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 8px 8px 0px ${COLORS.gray};
  }
`;

export const StyledColor = styled.div`
  background-color: ${(props) => {
    return props.color;
  }};
  color: ${(props) => {
    return props.isDarkColor ? COLORS.white : COLORS.black;
  }};
  height: 100px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledStatusColor = styled(StyledColor)`
  border: 1px solid
    ${(props) => {
      return props.borderColor;
    }};
`;
