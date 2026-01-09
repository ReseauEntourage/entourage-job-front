import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const ItemContainer = styled.div`
  display: flex;
  background: ${COLORS.hoverBlue};
  padding: 8px 10px;
  border-radius: 50px;
  cursor: pointer;
  text-wrap: nowrap;
`;
