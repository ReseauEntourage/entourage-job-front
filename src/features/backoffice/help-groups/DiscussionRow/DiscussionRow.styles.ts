import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledDiscussionRow = styled.article`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 16px;
  background-color: ${COLORS.white};

  &:hover {
    border-color: ${COLORS.primaryBlue};
  }
`;

export const StyledDiscussionRowTitle = styled.div`
  overflow-wrap: anywhere;

  a {
    color: ${COLORS.black};
    text-decoration: none;
  }
`;

export const StyledDiscussionRowFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;
