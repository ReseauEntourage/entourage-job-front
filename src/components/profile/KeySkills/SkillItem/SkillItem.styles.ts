import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledSkillItem = styled.div`
  display: flex;
  background: ${COLORS.hoverBlue};
  color: ${COLORS.primaryBlue};
  border-radius: 30px;
  padding: 4px 10px;
  gap: 10px;
`;
