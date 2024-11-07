import styled from 'styled-components';

export const StyledReviewItemContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: stretch;

  .edit-buttons {
    display: flex;
    flex-shrink: 0;
    align-items: center;
  }
`;

export const StyledReviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: auto;
`;
