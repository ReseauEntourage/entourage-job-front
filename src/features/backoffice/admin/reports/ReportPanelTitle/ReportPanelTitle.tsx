import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

/**
 * Title of a panel of the report pages: 16px, semibold, with an optional
 * count in regular grey (« Signalements reçus (2) »).
 */
export const ReportPanelTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  color: ${COLORS.black};
`;

export const ReportPanelTitleCount = styled.span`
  font-weight: 400;
  color: ${COLORS.darkGray};
`;
