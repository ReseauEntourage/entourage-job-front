import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledOrienterBackground = styled.div`
  background-color: ${COLORS.hoverBlue};
`;

export const StyledInscrireList = styled.ul`
  color: ${COLORS.darkGray};
  padding: 5px 0;
  li {
    list-style: none;
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    svg {
      min-width: 35px;
      margin-right: 10px;
      rect {
        fill: ${COLORS.orangeSocial};
      }
    }
  }
  &.mobile {
    padding: 5px 0;
    li {
      margin-bottom: 10px;
    }
  }
`;

export const StyledOrienterInscrireContainer = styled.div`
  ul {
    color: ${COLORS.darkGray};
    padding: 5px 0;
    li {
      list-style: none;
      margin-bottom: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      svg {
        min-width: 35px;
        margin-right: 10px;
        rect {
          fill: ${COLORS.orangeSocial};
        }
      }
    }
  }
  p:last-of-type {
    margin-bottom: 44px;
  }

  ul {
    padding: 5px 0;
    li {
      margin-bottom: 10px;
    }
  }
`;
