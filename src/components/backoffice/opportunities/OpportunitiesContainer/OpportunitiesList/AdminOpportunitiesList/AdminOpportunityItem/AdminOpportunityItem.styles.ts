import styled from 'styled-components';
import { StyledOpportunityItemContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/OpportunitiesList.styles';
import { COLORS } from 'src/constants/styles';

export const StyledAdminOpportunityItemContainer = styled(
  StyledOpportunityItemContainer
)`
  position: relative;
`;

export const StyledAdminOpportunityItemSeparator = styled.div`
  width: 100%;
  border-bottom: ${COLORS.gray} 2px solid;
  margin: 10px 0;
`;
