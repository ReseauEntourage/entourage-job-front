import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledVerifyEmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  background-color: ${COLORS.lightGray};
  border-radius: 10px;
  padding: 40px;
  align-items: flex-start;
  gap: 20px;
  justify-content: flex-start;
  height: 100%;
`;

export const StyledVerifyEmailRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  vertical-align: middle;
  align-items: center;
  justify-content: flex-start;
`;
