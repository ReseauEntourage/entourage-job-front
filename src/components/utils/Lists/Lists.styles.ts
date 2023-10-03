import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCheckListElement = styled.li`
  list-style: none;
  position: relative;
  padding-left: 32px;
  margin-bottom: 40px;
  &:before {
    content: '';
    height: 10px;
    width: 10px;
    padding: 2px;
    background: url('/static/img/icons/check.svg') no-repeat center
        center/contain content-box,
      ${COLORS.primaryOrange};
    position: absolute;
    border-radius: 20px;
    left: 0;
  }
  p {
    margin: 0;
  }
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
