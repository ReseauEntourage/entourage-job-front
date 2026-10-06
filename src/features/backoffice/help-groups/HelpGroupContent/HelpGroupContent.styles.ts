import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledHelpGroupContent = styled.div`
  white-space: pre-line;
  overflow-wrap: anywhere;
  color: ${COLORS.black};
  font-size: 14px;
  line-height: 1.6;

  a {
    color: ${COLORS.primaryBlue};
    text-decoration: underline;
  }
`;
