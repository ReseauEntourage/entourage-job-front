import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledEditorWrapper = styled.div`
  position: relative;
`;

export const StyledEditor = styled.div`
  white-space: pre-wrap;
  background: #f3f6f9;
  border-radius: 8px;
  padding: 16px;
  max-height: 320px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.8;
  outline: none;
  cursor: text;
  border: 1px solid transparent;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${COLORS.primaryBlue};
  }

  .mention-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 1px 8px;
    background-color: ${COLORS.hoverBlue};
    color: ${COLORS.primaryBlue};
    border: 1px solid ${COLORS.primaryBlue}44;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 500;
    user-select: none;
    cursor: default;
    vertical-align: middle;
    line-height: 1.6;

    button {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0 0 0 2px;
      color: ${COLORS.primaryBlue};
      font-size: 15px;
      line-height: 1;
      display: flex;
      align-items: center;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }
  }
`;
