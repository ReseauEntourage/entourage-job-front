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

export const StyledAiderProgrammesCTAsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${(props) => (props.marginTop ? '60px' : '0')};
  button:first-child {
    margin-right: 20px;
  }
  button {
    margin-top: 4px;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: left;
  gap: 20px;
  flex-wrap: wrap;
`;
