import styled from 'styled-components';
import CheckIcon from 'assets/icons/check.svg';
import { COLORS } from 'src/constants/styles';

export const StyledCheckListElement = styled.li`
  list-style: none;
  position: relative;
  padding-left: 32px;
  margin-bottom: 40px;

  p {
    margin: 0;
  }
`;

export const StyledCheckIcon = styled(CheckIcon)`
  height: 14px;
  width: 14px;
  padding: 2px;
  background-color: ${COLORS.primaryOrange};
  color: white;
  position: absolute;
  border-radius: 14px;
  left: 0;
`;

export const StyledBulletListElement = styled.li`
  list-style: none;
  position: relative;
  padding-left: 32px;
  margin-bottom: 40px;
  &:before {
    content: '';
    height: 12px;
    width: 12px;
    background-color: ${COLORS.primaryOrange};
    position: absolute;
    border-radius: 20px;
    left: 0;
  }
  p {
    margin: 0;
  }
`;
