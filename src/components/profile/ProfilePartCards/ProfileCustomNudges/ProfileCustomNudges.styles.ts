import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledItem = styled.div`
  background: ${COLORS.hoverBlue};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  padding: 20px 10px;
`;
