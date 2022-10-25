import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledHelpCard = styled.div`
  width: 20%;
  padding: 20px 16px;
  border: solid 1px ${COLORS.gray};
  border-radius: 5px;
  box-shadow: 0px 4px 4px 0px #0000001a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 280px;
  margin-bottom: 24px;
  h4 {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 16px;
  }
`;
