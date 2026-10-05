import { styled } from 'styled-components';

export const StyledMessageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const StyledMessageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const StyledMessageFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const StyledMessageEditor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledMessageEditorActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
