import styled, { css } from 'styled-components';

export const StyledContainer = styled.span`
  display: flex;
  flex-direction: row;
  ${({ textWrap }) => {
    return textWrap
      ? css`
          max-width: 100px;
        `
      : css`
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        `;
  }}
`;
