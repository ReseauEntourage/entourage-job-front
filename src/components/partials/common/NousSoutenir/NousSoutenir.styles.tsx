import { COLORS } from 'src/constants/styles';
import styled from 'styled-components';

export const StyledNousSoutenirCardsContainer = styled.div`
    padding: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    gap: 10px;
`;

export const StyledNousSoutenirCard = styled.div`
    border-radius: 30px;
    background-color: ${COLORS.hoverBlue};
`;