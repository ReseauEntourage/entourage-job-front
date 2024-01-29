import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledInformationsPersonnellesList = styled.ul`
  padding-left: 0;
  li {
    list-style: none;
    &:not(:last-child) {
      margin-bottom: 30px;
    }
    svg {
      margin-right: 10px;
      color: ${COLORS.primaryOrange};
    }
  }
  h5 {
    margin-top: 30px;
  }
`;

export const StyledUserInformationCardTags = styled.li`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;
