import styled from 'styled-components';
import { COLORS, FONT_WEIGHTS } from 'src/constants/styles';

export const StyledCareerPathSentenceContainer = styled.div`
  font-weight: 700;
`;

export const StyledCareerPathHightlightBusinessSector = styled.span`
  color: ${COLORS.primaryBlue};
  background: ${COLORS.hoverBlue};
  padding: 4px 10px;
  border-radius: 30px;
`;

export const StyledCareerPathHightlightOccupation = styled.span`
  font-weight: ${FONT_WEIGHTS.bold};
`;
