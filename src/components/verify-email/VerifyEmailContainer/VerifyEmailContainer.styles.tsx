import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledVerifyEmailContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  vertical-align: middle;
  align-items: center;
  justify-items: center;
  gap: 20px;
  justify-content: left;
  height: 100%;
`;

export const StyledVerifyEmailSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  background-color: ${COLORS.lightgray};
  padding: 40px;
  border-radius: 10px;
  align-items: left;
  justify-content: center;
`;
