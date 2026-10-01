import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledAuthorCard = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 20px;
  background-color: ${COLORS.white};
  text-align: center;

  a {
    color: ${COLORS.primaryBlue};
  }
`;
