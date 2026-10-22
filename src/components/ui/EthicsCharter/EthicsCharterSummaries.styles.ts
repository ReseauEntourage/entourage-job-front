import { styled } from 'styled-components';

/**
 * Sections of the charter summary — icon, title and bullets — shared by the
 * messaging reminder modal and the help groups frame.
 */
export const StyledEthicsCharterSummaries = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0 20px 0;
`;

export const StyledEthicsCharterSummary = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const StyledEthicsCharterSummaryIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 3px;
`;

export const StyledEthicsCharterSummaryBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

/**
 * The product bullets, tightened: a summary of five sections read at a glance
 * needs a denser rhythm than the full charter page they were sized for.
 */
export const StyledEthicsCharterSummaryPoints = styled.div`
  li {
    padding-left: 18px;

    &:not(:last-child) {
      margin-bottom: 2px;
    }

    &:before {
      width: 6px;
      height: 6px;
      top: 9px;
    }
  }
`;
