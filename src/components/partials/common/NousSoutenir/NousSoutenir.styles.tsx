import { COLORS } from 'src/constants/styles';
import styled from 'styled-components';

export const StyledNousSoutenirCardsContainer = styled.div`
    padding: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    gap: 35px;
`;

export const StyledNousSoutenirCard = styled.div`
    background-color: ${COLORS.hoverBlue};
    flex: 1;
    `;

export const StyledNousSoutenirCardUpperPart = styled.div<{ color: string }>`
    background-color: ${props => props.color};
    border-radius: 30px 30px 0 0; 
    color: white;
    font-size: 40px;
    font-weight: 700;
    text-align: center;
    height: 70px;
    line-height: 40px;
    padding: 15px;
    box-sizing: border-box;
`;

export const StyledNousSoutenirCardLowerPart = styled.div`
    background-color: ${COLORS.hoverBlue};
    padding: 20px 20px 50px;
    box-sizing: border-box;
    color: black;
    span {
        color: ${COLORS.primaryBlue};
    }
`;