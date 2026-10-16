import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledHelpGroupAuthor = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;

  a {
    color: ${COLORS.black};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const StyledHelpGroupAuthorRole = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  background-color: ${COLORS.hoverBlue};
  color: ${COLORS.darkTeal};
  font-size: 12px;
`;
