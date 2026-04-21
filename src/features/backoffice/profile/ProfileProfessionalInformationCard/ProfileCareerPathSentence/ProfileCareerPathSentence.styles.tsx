import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledCareerPathSimpleSentenceTag = styled.span`
  color: ${COLORS.primaryBlue};
`;

export const StyledCareerPathSectorOccupationTagContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledCompanyName = styled.span<{ withLink?: boolean }>`
  color: ${COLORS.black};
  text-decoration: ${(props) => (props.withLink ? 'underline' : 'none')};
`;
