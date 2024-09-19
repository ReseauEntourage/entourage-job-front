import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledUserActionsBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: ${COLORS.gray} 1px solid;
  transition: 0.3s ease-in-out;
  a {
    color: ${COLORS.gray};
  }
`;
