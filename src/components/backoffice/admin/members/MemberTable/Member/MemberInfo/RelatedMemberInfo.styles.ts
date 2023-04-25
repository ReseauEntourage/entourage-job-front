import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledRelatedMemberListItem = styled.div`
  :not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const StyledNumberCandidates = styled.div`
  font-weight: bold;
  color: ${COLORS.black};
`;

export const StyledNumberCandidatesContainer = styled.div`
  display: flex;
`;
