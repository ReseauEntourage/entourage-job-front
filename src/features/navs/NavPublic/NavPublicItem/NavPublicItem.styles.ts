import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledNavPublicItemMobileLinkContainer = styled.div<{
  selected: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 16px;
  margin: 4px 0;
  border-radius: 999px;
  background-color: ${(props) =>
    props.selected ? COLORS.primaryBlue : 'transparent'};

  a {
    font-family: Poppins, sans-serif;
    font-weight: ${(props) => (props.selected ? '700' : '400')};
    color: ${(props) => (props.selected ? COLORS.white : COLORS.black)};
    text-decoration: none;
  }
`;
