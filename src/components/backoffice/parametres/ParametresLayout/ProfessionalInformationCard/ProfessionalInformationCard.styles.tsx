import styled from 'styled-components';

export const StyledProfessionalInformationList = styled.ul`
  padding-left: 0;
  li {
    list-style: none;
    &:not(:last-child) {
      margin-bottom: 30px;
    }
    &.tag-container > div {
      margin-bottom: 10px;
    }
  }
`;
