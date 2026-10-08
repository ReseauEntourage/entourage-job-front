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
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  background-color: ${COLORS.extraExtraLightOrange};

  p a {
    font-weight: ${FONT_WEIGHTS.semibold};
  }
`;

// The contact block of the dashboard, compact: picture, name, role, mail link
export const StyledReportReferent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background-color: ${COLORS.white};
`;

export const StyledReportReferentPicture = styled.div`
  flex: none;
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;

  @media (max-width: 767px) {
    width: 44px;
    height: 44px;
  }
`;

export const StyledReportReferentIdentity = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-wrap: anywhere;

  > * {
    margin: 0;
  }
`;

export const StyledReportError = styled.p`
  margin: 0;
  color: ${COLORS.red};
`;
