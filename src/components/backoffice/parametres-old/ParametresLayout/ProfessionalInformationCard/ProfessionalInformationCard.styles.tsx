import styled from 'styled-components';

export const StyledProfessionalInformationList = styled.ul`
  padding-left: 0;
  div {
    display: inline;
  }
  li {
    list-style: none;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }

  .tag-container {
    gap: 12px;
    display: flex;
    flex-wrap: wrap;
  }
`;

export const StyledProfessionalInformationImgContainer = styled.div`
  position: relative;
  height: 45px;
  margin-right: 15px;
  vertical-align: middle;
`;

export const StyledProfessionalInformationLinkedinContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
`;
