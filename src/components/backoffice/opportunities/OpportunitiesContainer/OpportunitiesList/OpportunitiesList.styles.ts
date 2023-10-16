import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledListContainer = styled.div`
  overflow: hidden;
  position: relative;
  flex: 4;
  @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const StyledLinkCard = styled.a``;

export const StyledListItem = styled.div`
  border: 1px solid
    ${({ isSelected }) => {
      return isSelected ? COLORS.primaryOrange : COLORS.lightgray;
    }};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 14px;
`;

export const StyledListItemContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const StyledListContent = styled.div`
  height: 100%;
  position: relative;
`;



export const StyledOpportunityItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

export const StyledOpportunityItemTopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledOpportunityItemIcon = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1px ${COLORS.gray} solid;
  color: ${COLORS.gray};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledOpportunityItemTitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledOpportunityItemActionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const StyledOpportunityItemTitle = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledOpportunityItemCompany = styled.div`
  text-overflow: ellipsis;
`;

export const StyledOpportunityItemInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
`;

export const StyledOpportunityItemBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledOpportunityItemDescription = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
  color: ${COLORS.black};
`;
