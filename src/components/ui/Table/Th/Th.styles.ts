import styled, { css } from 'styled-components';

export const StyledTh = styled.th`
  white-space: nowrap;
  position: sticky;
  top: 0;
  padding: 16px 15px;
  text-align: left;
  vertical-align: bottom;
  font-size: 0.875rem;
  font-weight: 400;
  color: #999;

  ${({ isMobile }) => {
    return (
      isMobile &&
      css`
        display: none;
      `
    );
  }}
`;
