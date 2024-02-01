import { COLORS } from 'src/constants/styles';
import styled from 'styled-components';

export const DashboardOpportunitiesSpinnerContainer = styled.div`

`;

export const StyledDashbordOpportunitiesInProgress = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export const StyledDashboardOpportunitiesListContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 45px;
`;

export const StyledDashboardOpportunityItem = styled.div`
    width: calc(30% - 30px);
    border: 1px solid ${COLORS.gray};
    box-shadow: 0px 4px 4px 0px #00000008;
    border-radius: 10px;
    padding: 20px 10px;
    transition: all 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        box-shadow: 0px 4px 4px 0px #0000001a;
    
    }
`;

export const StyledDashboardOpportunityItemTitle = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box !important;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal;
    font-size: 16px;
    height: 60px;
    margin-bottom: 15px;
`;

export const StyledDashboardOpportunityItemBLs = styled.div`
    > div {
        margin-right: 10px;
        margin-bottom: 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: normal;
    }
`;

export const StyledDashboardOpprtunityCTAOrSpinnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    width: 100%;
`;