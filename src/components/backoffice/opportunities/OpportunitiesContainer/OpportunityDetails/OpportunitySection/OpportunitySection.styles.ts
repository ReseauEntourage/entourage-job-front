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
  border-bottom: 1px ${COLORS.primaryBlue} solid;
`;

export const StyledOpportunitySectionContentContainer = styled.div`
  margin-top: 12px;
`;

export const StyledOpportunitySectionList = styled.ul`
  padding-left: 0;
  margin-bottom: 0;
  > li {
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
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
  height: inherit !important;
  &:not(.orange) {
    &:hover {
      cursor: pointer;
      color: ${COLORS.primaryBlue} !important;
    }
  }
  &.orange {
    span,
    select {
      color: ${COLORS.primaryBlue} !important;
    }
  }
`;

export const StyledOpportunitySectionCandidateName = styled.div`
  flex: 1;
`;

export const StyledOpportunitySectionCandidateSelect = styled.div`
  margin-left: 16px;
  display: flex;
  width: 200px;
  align-items: center;
  margin-bottom: -30px;
  > * {
    flex: 1;
  }
`;

export const StyledActionLabelContainer = styled.div`
  color: ${COLORS.primaryBlue};
`;
