import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`;

export const StyledOpportunitySectionTitleContainer = styled.div`
  flex: 1;
  flex-direction: column;
  border-bottom: 1px ${COLORS.primaryOrange} solid;
`;

export const StyledOpportunitySectionContentContainer = styled.div`
  margin-top: 12px;
`;

export const StyledOpportunitySectionList = styled.ul`
  padding-left: 0;
  margin-bottom: 0;
  li {
    list-style: none;
    display: flex;
    align-items: center;
    height: 33px;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    span {
      flex: 1;
    }
  }
`;

export const StyledOpportunitySectionCandidateLi = styled.li`
  &:not(.orange) {
    &:hover {
      cursor: pointer;
      color: ${COLORS.primaryOrange} !important;
    }
  }
  &.orange {
    span,
    select {
      color: ${COLORS.primaryOrange} !important;
    }
  }
`;

export const StyledOpportunitySectionCandidateSelect = styled.select`
  border: none;
  border-bottom: ${COLORS.gray} 1px solid;
  background-color: transparent;
  padding: 5px 0;
  &:focus {
    outline: none;
  }
`;
