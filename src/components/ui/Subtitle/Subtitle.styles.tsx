import styled from 'styled-components';

export const StyledSubtitle = styled.div`
  margin: 40px 0;
  width: 100%;
  text-align: ${({ center }) => {
    return center ? 'center' : 'left';
  }};
`;
