import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

/** Short colored rule (100px) separating two blocks of text. */
export const StyledDividerSmall = styled.hr`
  /* The default rule of the browser is reset: the rule is the 100px line below. */
  border: none;
  margin-bottom: 20px;
  line-height: 0;

  * + & {
    margin-top: 20px;
  }

  &::after {
    content: '';
    display: inline-block;
    width: 100px;
    max-width: 100%;
    border-top: 1px solid ${COLORS.primaryBlue};
    vertical-align: top;
  }
`;
