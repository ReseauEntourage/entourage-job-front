import { COLORS } from 'src/constants/styles';
import styled from 'styled-components';

export const StyledSimpleIconCTACardsGridBackground = styled.div`
    background-color: ${COLORS.lightgray};
`;

export const StyledSimpleIconCTACardsGridSubtitle = styled.div`
    width: 100%;
    text-align: center;
`;

export const StyledSimpleIconCTACardsGrid = styled.div`
margin-top: 80px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 80px;
    /* margin-top: 140px; */
flex-wrap: wrap;
`;

export const StyledSimpleIconCTACard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    border-radius: 30px;
    background-color: ${COLORS.white};
    width: 460px;
    box-sizing: border-box;
    text-align: center;
    gap: 30px;
`;