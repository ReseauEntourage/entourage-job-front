import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledLi = styled.li`
  list-style: none;
  position: relative;
  padding-left: 32px;
  &:not(:last-child) {
    margin-bottom: 40px;
  }
  p {
    margin: 0;
  }
`;

export const StyledBulletListElement = styled(StyledLi)`
  &:before {
    content: '';
    height: 12px;
    width: 12px;
    background-color: ${COLORS.primaryBlue};
    position: absolute;
    border-radius: 20px;
    left: 0;
    top: 4px;
  }
`;

export const StyledList = styled.ul`
  padding: 0;
  list-style: none;
`;

export const StyledCheckIconContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  padding: 2px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.hoverBlue};
  color: white;
  position: absolute;
  border-radius: 14px;
  left: 0;
`;
