import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 24px;
`;

export const StyledNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 24px;
  font-weight: 700;
  line-height: 29px;
  margin-bottom: 8px;
`;

export const StyledRoleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
`;
export const StyledRole = styled.div`
  margin-left: 4px;
`;

export const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 18px;
  justify-content: center;

  .bold {
    font-weight: bold;
  }
`;
