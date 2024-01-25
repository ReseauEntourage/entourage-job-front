import styled from 'styled-components';

export const StyledIconsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 40px;
    justify-content: space-between;
`;

export const StyledIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
    width: 150px;
    text-align: center;
    border: 1px solid #F5F5F5;
    padding: 10px;
    box-sizing: border-box;
    svg { 
        height: 100%;
        width: 100%;
    }
`;