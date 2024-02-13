import { COLORS } from 'src/constants/styles';
import styled from 'styled-components';


const NOTIF_WIDTH = "400px";

export const StyledNotificationsContainer = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 20px;
    top: 143px;
    right: 0;
    width: ${NOTIF_WIDTH};
    height: 50px;
`;


const StyledNotification = styled.div`
    box-sizing: border-box;
    width: ${NOTIF_WIDTH};
    height: 50px;
    line-height: 50px;
    color: white;
    padding-left: 20px;
    border-radius: 5px 0 0 5px;
    /* transform: ${(props) => props.hasTranslated ? 'translateX(O)' : `translateX(${NOTIF_WIDTH})`}; */
    transform: translateX(O);
    transition: 0.5s ease-in-out;
    @keyframes moveLeft {
        100% {
            transform: translateX(${NOTIF_WIDTH});
        }
    }
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