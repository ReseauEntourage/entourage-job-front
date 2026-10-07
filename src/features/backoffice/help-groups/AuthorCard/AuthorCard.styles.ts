import { styled } from 'styled-components';
import { COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledAuthorCard = styled.aside`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
`;

export const StyledAuthorCardIdentity = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

// The profile link takes the whole width of the card, under the identity
export const StyledAuthorCardLink = styled.div`
  flex-basis: 100%;

  a,
  button {
    width: 100%;
  }
`;
