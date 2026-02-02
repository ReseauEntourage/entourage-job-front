import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledProfileCareerPathLi = styled.li`
  line-height: 24px;
`;

export const StyledCareerPathSimpleSentenceTag = styled.span`
  color: ${COLORS.primaryBlue};
`;

export const StyledCareerPathSectorOccupationTagContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledCompanyName = styled.span<{ withLink?: boolean }>`
  color: ${COLORS.black};
  text-decoration: ${(props) => (props.withLink ? 'underline' : 'none')};
`;
