import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

/** Row of the tabs of a member, as small gray capitals. */
export const StyledMemberTabs = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin-left: -20px;
  padding: 0;
  list-style: none;
`;

export const StyledMemberTab = styled.li<{ $active: boolean }>`
  flex: none;
  position: relative;
  padding-left: 20px;

  > a {
    display: block;
    color: ${COLORS.mutedText};
    font-size: 0.875rem;
    text-transform: uppercase;
    transition: 0.1s ease-in-out;
    transition-property: color, background-color;
  }

  > a:hover,
  > a:focus {
    color: ${COLORS.black};
    text-decoration: none;
    outline: none;
  }

  ${({ $active }) =>
    $active &&
    `
    > a,
    > a:hover,
    > a:focus {
      color: ${COLORS.navActive};
    }
  `}
`;

/** Title of the page shown when the member does not exist. */
export const StyledMemberNotFoundTitle = styled.h3`
  font-weight: 700;
`;
