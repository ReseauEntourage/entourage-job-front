import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCardCommon = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: ${COLORS.white};
  box-shadow: 0 4px 8px 0 ${COLORS.lightgray};
  position: relative;
`;
