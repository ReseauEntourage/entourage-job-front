import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledHeaderBackOffice = styled.div`
  h2 {
    margin: 0;
  }
  p {
    margin: 0;
    font-size: 14px;
  }
  hr {
    opacity: 0.6;
  }
  .notif-container {
    padding: 12px;
    border-top: 0.5px solid ${COLORS.gray};
    border-bottom: 0.5px solid ${COLORS.gray};
    margin: 30px 0;
    font-weight: 700;
    font-size: 14px;
    .uk-badge {
      margin-right: 10px;
      min-width: 25px;
      padding: 2px 5px;
    }
  }
  .simple-separator {
    border-bottom: 0.5px solid ${COLORS.gray};
    margin: 30px 0;
  }
`;
