import styled from 'styled-components';

export const StyledMemberTabLoaderContainer = styled.div`
  position: relative;
`;

export const StyledMemberActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  & > button {
    margin-left: 8px;
    margin-top: ${({ isMobile }) => {
      return isMobile ? 8 : 0;
    }}px;
  }
`;

export const StyledRelatedMemberList = styled.div`
  margin-top: 72px;
`;
