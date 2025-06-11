import styled from 'styled-components';

export const StyledParametersSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StyledParametersLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  flex: 2;
  &.mobile {
    min-width: unset;
    width: 100%;
    margin-bottom: 40px;
  }
`;

export const StyledParametersRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 400px;
  gap: 40px;
  &.mobile {
    width: 100%;
  }
`;
