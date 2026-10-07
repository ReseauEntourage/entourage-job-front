import { styled } from 'styled-components';
import { COLORS, FONT_WEIGHTS } from '@/src/constants/styles';

export const StyledReportModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* Keeps the gap above the footer rule, which sits outside the body */
  padding-bottom: 20px;
  text-align: left;
`;

export const StyledReportExcerpt = styled.blockquote`
  margin: 0;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${COLORS.lightGray};
  overflow-wrap: anywhere;
`;

export const StyledReportExcerptAuthor = styled.span`
  font-weight: ${FONT_WEIGHTS.semibold};
  color: ${COLORS.black};
`;

export const StyledReportHelp = styled.aside`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 8px;
  background-color: ${COLORS.extraExtraLightOrange};

  a {
    font-weight: ${FONT_WEIGHTS.semibold};
  }
`;

export const StyledReportHelpIcon = styled.span`
  flex: none;
  display: flex;
  padding-top: 2px;
`;

export const StyledReportHelpText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const StyledReportReferent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledReportError = styled.p`
  margin: 0;
  color: ${COLORS.red};
`;
