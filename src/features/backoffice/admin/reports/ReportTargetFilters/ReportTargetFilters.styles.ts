import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledReportFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  margin: 24px 0;
  padding: 16px 20px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    padding: 12px;
  }
`;

// Layout of the type pills in the filters bar
export const StyledReportTypePills = styled.div`
  display: flex;
  flex: 1 1 420px;
  min-width: 0;

  > * {
    flex: 1;
  }

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    flex-basis: 100%;
  }
`;

export const StyledReportSelects = styled.div`
  display: flex;
  gap: 16px;

  /* Fixed width: the field must not resize when its text goes from the
     chosen option to the placeholder shown while the list is open */
  > * {
    flex: none;
    width: 220px;
  }

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    flex-basis: 100%;
    gap: 8px;

    > * {
      width: auto;
      min-width: 0;
    }
  }
`;
