import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCVPDFQuote = styled.div`
  width: 105px;
  margin-top: 20px;
  text-align: center;
  font-size: 8px;
  line-height: 10px;
  position: relative;
  span.uk-icon {
    color: ${COLORS.primaryOrange};
    height: 15px;
    width: 15px;
    position: absolute;
    :first-of-type {
      left: -15px;
      top: 0;
      margin-right: 8px;
      svg {
        transform: translateY(-8px) rotate(180deg);
      }
    }
    :last-of-type {
      margin-left: 8px;
      right: -15px;
      bottom: 0;
      svg {
        transform: translateY(8px);
      }
    }
  }
`;

export const StyledCVPDFH1 = styled.h1`
  font-size: 25px;
  line-height: 30px;
  margin-bottom: 8px;
  text-transform: capitalize;
  font-weight: 700;
`;

export const StyledCVPDFCareerPath = styled.div`
  font-size: 10px !important;
  line-height: 12px !important;
`;

export const StyledCVPDFTitle = styled.h6`
    font-size: 10px;
    line-height: 12px;
    font-weight: 700;
    margin-bottom: 5px;
`;


export const StyledCVPDFPage = styled.div`
    height: 1122px;
    width: 794px;
    margin-bottom: 50px;
    background-color: #fff8f5;
    display: flex;
    flex-direction: column;
    ul {
        margin: 0;
        padding-left: 0;
        li {
            list-style: none;
        }
    }
    p {
        margin: 0;
    }
`;
