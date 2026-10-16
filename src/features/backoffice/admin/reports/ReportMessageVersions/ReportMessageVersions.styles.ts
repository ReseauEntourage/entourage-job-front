import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledReportVersions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledReportVersionList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StyledReportVersion = styled.li<{ $isCurrent: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 14px;
  box-shadow: inset 2px 0 0
    ${({ $isCurrent }) => ($isCurrent ? COLORS.primaryBlue : COLORS.gray)};
  white-space: pre-wrap;
`;
