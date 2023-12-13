import styled from 'styled-components';
import { StyledTabsUl } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.styles';
import { HEIGHTS } from 'src/constants/styles';

export const StyledAdminTabsUl = styled(StyledTabsUl)`
  margin-bottom: ${HEIGHTS.SECTION_PADDING}px;
  li {
    width: 25%;
  }
`;
