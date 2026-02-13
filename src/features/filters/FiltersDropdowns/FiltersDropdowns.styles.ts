import styled from 'styled-components';

export const StyledDropdownContainer = styled.div<{
  smallSelectors: boolean;
  disabled: boolean;
  showSeparator: boolean;
}>`
  display: inline;

  /* ent-select-search */
  background-color: transparent;
  font-size: 0.9rem;
  border: none;
  padding: 0 12px 0;
  border-left: 1px solid white;
  height: 44px;
  display: flex;

  /* smallSelectors */
  ${(props) =>
    props.smallSelectors &&
    `
      padding: 0;
    `}

  /* disabled */
  ${(props) =>
    props.disabled &&
    `
      opacity: 0.6;
      `}

      ${(props) =>
    props.showSeparator &&
    `
      border-left: 1px solid #e0e0e0;
      `}
`;
