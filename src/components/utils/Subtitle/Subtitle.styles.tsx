import styled from 'styled-components';

export const StyledSubtitle = styled.div`
  color: #999 !important;
  margin-top: 40px;
  margin-bottom: 0 !important;
  font-style: italic;
  font-size: 15px;
  width: 100%;
  text-align: ${({ center }) => {
    return center ? 'center' : 'left';
  }};
`;
