import { COLORS } from 'src/constants/styles';
import styled from 'styled-components';

export const StyledNotificationsContainer = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 20px;
    top: 143px;
    right: 0;
`;


const StyledNotification = styled.div`
    
    box-sizing: border-box;
    width: 400px;
    height: 50px;
    line-height: 50px;
    color: white;
    padding-left: 20px;
    border-radius: 5px 0 0 5px;
    transform: ${(props) => props.hasTranslated ? 'translateX(O)' : 'translateX(400px)'};
    transition: 0.5s ease-in-out;
    svg {
        margin-right: 20px;
        height: 25px;
    }
`;

export const StyledSuccessNotification = styled(StyledNotification)`
    background-color: ${COLORS.yesGreen};
`;

export const StyledFailedNotification = styled(StyledNotification)`
    background-color: ${COLORS.noRed};
`;