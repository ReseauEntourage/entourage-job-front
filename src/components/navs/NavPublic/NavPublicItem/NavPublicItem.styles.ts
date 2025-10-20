import styled from 'styled-components';

export const StyledNavPublicItemMobileLinkContainer = styled.div<{
  selected: boolean;
}>`
  display: flex;
  align-items: center;
  a {
    font-weight: ${(props) => (props.selected ? '600' : '400')};
    color: white;
    text-decoration: ${(props) => (props.selected ? 'underline' : 'none')};
  }
`;
