import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledHelpCard = styled.div`
  width: 20%;
  padding: 20px 16px;
  border: solid 1px ${COLORS.gray};
  border-radius: 5px;
  box-shadow: 0px 4px 4px 0px #0000001a;
  min-width: 280px;
  margin-bottom: 24px;
  &:hover {
    transition: 0.2s ease-in-out;
    cursor: pointer;
    box-shadow: 0px 4px 8px 4px #0000001a;
  }
  .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: 100%;
    h4 {
      font-weight: 700 !important;
      font-size: 14px !important;
      margin-bottom: 16px !important;
    }
  }
`;

export const StyledLink = styled.a`
  color: black;
  &:hover {
    color: black;
  }
`;
