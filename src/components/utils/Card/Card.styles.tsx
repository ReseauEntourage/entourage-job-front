import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCard = styled.div`
  background-color: #fff;
  box-shadow: 0px 4px 4px 0px #0000000d;
  border-radius: 20px;
  padding: 25px;
  position: relative;
`;

export const StyledCardTitleContainer = styled.div`
  border-bottom: #fddfd2 solid 1px;
  margin-bottom: 30px;
  padding-right: 50px;
`;

export const StyledEditIconContainer = styled.div`
  position: absolute;
  right: 25px;
  display: flex;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: ${COLORS.primaryOrange} 1px solid;
`;

export const StyledSpinnerContainer = styled.div`
  position: absolute;
  right: 25px;
`;
