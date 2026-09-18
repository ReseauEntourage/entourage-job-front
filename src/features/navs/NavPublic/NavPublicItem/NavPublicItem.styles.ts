import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledNavPublicItemMobileLinkContainer = styled.div<{
  selected: boolean;
  $isChild?: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 48px;
  padding: ${({ $isChild }) => ($isChild ? '10px 16px 10px 32px' : '10px 16px')};
  border-radius: 12px;
  background-color: ${(props) =>
    props.selected ? COLORS.primaryBlue : 'transparent'};

  a {
    width: 100%;
    font-family: Poppins, sans-serif;
    font-size: 16px;
    font-weight: ${(props) => (props.selected ? '700' : '400')};
    color: ${(props) => (props.selected ? COLORS.white : COLORS.extraDarkGray)};
    text-decoration: none;
  }
`;
