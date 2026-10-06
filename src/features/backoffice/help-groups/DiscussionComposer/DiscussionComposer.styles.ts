import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledComposerBar = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 20px;
  background-color: ${COLORS.white};
  color: ${COLORS.darkGray};
  font-size: 16px;
  text-align: left;
  cursor: text;

  &:hover {
    border-color: ${COLORS.primaryBlue};
  }
`;

export const StyledComposer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid ${COLORS.primaryBlue};
  border-radius: 20px;
  background-color: ${COLORS.white};
`;

export const StyledTitleField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledTitleActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const StyledComposerActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
