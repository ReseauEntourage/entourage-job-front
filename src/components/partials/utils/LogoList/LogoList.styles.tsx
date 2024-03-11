import styled from 'styled-components';

export const LogoListFlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
  margin-left: -15px;
  justify-content: center;
  align-items: center;
  &.background {
    background-color: #fff;
  }
  &.border-rounded {
    border-radius: 5px;
  }
  &.padding {
  }
  padding: 15px;
`;

export const LogoListFlexItem = styled.div`
  box-sizing: border-box;
  padding-left: 15px;
  width: ${({ width }) => {
    return width;
  }};
`;

export const StyledCarouselItem = styled.div`
  margin: 0 40px !important;
`;
