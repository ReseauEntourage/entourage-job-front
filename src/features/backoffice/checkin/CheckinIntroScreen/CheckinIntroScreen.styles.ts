import { styled } from 'styled-components';

export const StyledCheckinIntroScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 480px;
  margin: 0 auto;
  padding: 48px 16px;
  text-align: center;
`;

export const StyledCheckinIntroList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
`;

export const StyledCheckinIntroListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const StyledCheckinIntroActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;
