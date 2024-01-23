import styled from 'styled-components';

export const StyledHelpList = styled.ul`
  padding-left: 0;
  li {
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: #484848;
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
`;

export const StyledHelpListImgContainer = styled.div`
  height: 45px;
  max-width: 45px;
  margin-right: 15px;
  position: relative;
  > svg {
    height: 45px;
    width: 45px;
    max-width: 45px;
  }
`;
