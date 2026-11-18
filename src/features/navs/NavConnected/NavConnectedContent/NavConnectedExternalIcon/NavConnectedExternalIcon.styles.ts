import { styled } from 'styled-components';

export const StyledExternalIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  flex-shrink: 0;

  /* Beats the generic "svg" spacing of the sub menus */
  &&& svg {
    margin: 0 !important;
  }
`;

export const StyledExternalIconGraphic = styled.span`
  display: inline-flex;
`;

export const StyledExternalIconHiddenLabel = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
