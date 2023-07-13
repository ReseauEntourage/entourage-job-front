import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCVCTA = styled.div`
  background-color: #ffffffe5;
  margin-bottom: 30px;
  border-radius: 30px;
  padding: 30px;
`;

export const StyledCVCTAContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
`;

export const StyledCVCTACard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  width: 26%;
  min-width: 200px;
  p {
    text-align: center;
    color: ${COLORS.darkGrayFont};
  }
  &.mobile {
    width: 100%;
    margin: 14px 0;
    order: ${(props) => {
      return props.order;
    }};
  }
`;
