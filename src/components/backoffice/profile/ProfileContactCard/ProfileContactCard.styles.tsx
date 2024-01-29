import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfileContactForm = styled.div`
  input,
  textarea {
    border: 1px solid #d8d8d8;
    border-radius: 10px;
    margin-top: 15px;
    min-height: 50px;
    padding: 15px;
  }
`;

export const StyledConfirmCheck = styled.div`
  height: 16px;
  width: 16px;
  background-color: ${COLORS.yesGreen};
  border-radius: 50%;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  svg {
    height: 10px;
    width: 10px;
    color: white;
  }
`;

export const StyledContactMessage = styled.div`
  background-color: ${COLORS.hoverOrange};
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  svg {
    margin-right: 10px;
  }
`;
