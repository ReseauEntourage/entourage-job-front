import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledConfirmationIntro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  margin-bottom: 24px;
`;

export const StyledConfirmationIcon = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.hoverBlue};
`;

export const StyledConfirmationActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

export const StyledHelp = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid ${COLORS.lightGray};
`;

export const StyledHelpList = styled.ul`
  margin: 12px 0 0;
  padding-left: 18px;

  li {
    margin: 8px 0;
  }
`;

export const StyledConfirmationResendEmail = styled.div`
  margin-top: 16px;
`;
