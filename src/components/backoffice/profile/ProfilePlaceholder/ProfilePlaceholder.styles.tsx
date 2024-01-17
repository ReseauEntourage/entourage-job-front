import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfileCardPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${COLORS.darkGrayFont};
    font-style: italic;
    p {
      margin-bottom: 0;
    }
    > div.illu-container {
      margin-right: 40px;
      svg {
        min-width: 70px;
      }
    }
  }
`;
