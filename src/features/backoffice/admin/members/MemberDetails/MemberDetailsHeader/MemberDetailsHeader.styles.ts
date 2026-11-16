import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 24px;
`;

export const StyledNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 24px;
  font-weight: 700;
  line-height: 29px;
  margin-bottom: 8px;
`;

export const StyledRoleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
`;

export const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 18px;
  justify-content: center;

  .bold {
    font-weight: bold;
  }
`;

/** Zone of the member, in a small colored tag. */
export const StyledZoneLabel = styled.span`
  display: inline-block;
  margin-top: 5px;
  padding: 0 10px;
  border-radius: 5px;
  background: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  font-size: 0.875rem;
  line-height: 20px;
  text-transform: uppercase;
  vertical-align: middle;
  white-space: normal;
`;
