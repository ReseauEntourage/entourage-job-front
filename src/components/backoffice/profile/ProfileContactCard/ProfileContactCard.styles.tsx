import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfileContactForm = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
`;

export const StyledContactMessage = styled.div`
  background-color: ${COLORS.hoverBlue};
  border-radius: 10px;
  padding: 10px;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  font-size: 13px;
  svg {
    margin-right: 10px;
  }
`;
