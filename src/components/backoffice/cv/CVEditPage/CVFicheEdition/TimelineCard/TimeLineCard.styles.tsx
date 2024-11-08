import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledFooterCount = styled.div`
  color: ${(props) => {
    return props.warning ? COLORS.red : `${COLORS.darkGray}`;
  }};
`;
