import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledOrienterPublierContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10%;
  .image-container {
    width: 40%;
    position: relative;
    img {
      border-radius: 40px;
    }
  }
  .text-container {
    width: 50%;
    ul {
      color: ${COLORS.darkGrayFont};
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
            fill: ${COLORS.primaryOrange};
          }
        }
      }
    }
    p:last-of-type {
      margin-bottom: 44px;
    }
  }
  &.mobile {
    flex-direction: column-reverse;
    .image-container {
      width: 100%;
      margin-bottom: 20px;
      height: 340px;
    }
    .text-container {
      width: 100%;
      ul {
        padding: 5px 0;
        li {
          margin-bottom: 10px;
        }
      }
    }
  }
`;
