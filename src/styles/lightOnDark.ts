import { css } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

/**
 * Colors of the content laid on a dark or colored background: white links,
 * titles and emphasis, and a softer white for the plain text. The selectors
 * are doubled so that they weigh as much as the element rules they must
 * override (titles, links, rules).
 */
export const lightOnDark = css`
  color: rgba(255, 255, 255, 0.7);

  && a,
  && a:hover,
  && em,
  && h1,
  && h2,
  && h3,
  && h4,
  && h5,
  && h6,
  && blockquote {
    color: ${COLORS.white};
  }

  && blockquote footer {
    color: rgba(255, 255, 255, 0.7);
  }

  && hr {
    border-top-color: rgba(255, 255, 255, 0.2);
  }

  && :not(pre) > code {
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.1);
  }
`;
