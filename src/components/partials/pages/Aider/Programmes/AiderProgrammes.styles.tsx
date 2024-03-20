import styled from 'styled-components';

export const StyledAiderProgrammesListElement = styled.li`
  list-style: none;
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  svg {
    margin-right: 10px;
  }
  &.mobile {
    padding: 5px 0;
    li {
      margin-bottom: 10px;
    }
  }
`;
