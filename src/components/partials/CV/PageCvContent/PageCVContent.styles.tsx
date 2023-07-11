import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';


export const StyledCVPageContent = styled.div`
    background-color: ${COLORS.wheat};
    display: flex;
    flex-direction: column;
    max-width: 1320px;
    margin: auto;
    > a {
        margin: 26px auto 0;
        color: black;
        font-size: 14px;
        line-height: 16px;
        width: 100%;
        display: block;
        max-width: 1320px;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .strong {
        font-weight: 700;
    }
    ul {
        padding-left: 0;
        list-style: none;
    }
`;

const BasicDivContainer = styled.div`
    margin: 26px 15px 0;
    /* width: 100%; */
    box-sizing: border-box;
`;

export const StyledCVPageContentHeader = styled(BasicDivContainer)`
    display: flex;
    flex-direction: row;
    background-color: #FFFFFFE5;
    border-radius: 30px;
    padding: 30px;    
    h1 {
        text-transform: uppercase;
    }
    #header-details {
        padding-left: 55px;
        line-height: 24px;
        #quote {
            span.uk-icon {
                color: ${COLORS.primaryOrange};
                :first-of-type {
                    margin-right: 8px;
                    svg {
                        transform: translateY(-8px) rotate(180deg);
                    }
                }
                :last-of-type {
                    margin-left: 8px;
                    svg {
                        transform: translateY(8px);
                    }
                }
            }
        }
    }
`;

export const StyledCVProfilePicture = styled.div`
    height: 450px;
    width: 355px;
    position: relative;
    .picture {
        height: 408px;
        width: 270px;
        border-radius: 859px 909px 729px 659px;
        background-image: ${(props) => {
            return `url('${props.imgSrc}')`;
          }};
        background-position: center;
        position: absolute;
        z-index: 2;
        left: 35px
    }
    .pseudo {
        background-color: #F55F241A;
        width: 450px;
        left: -47px;
        bottom: 89px;
        height: 300px;
        position: absolute;
        transform: rotate(-83.94deg);
        border-radius: 859px 909px 729px 659px;
        z-index: 1;
    }
`;

export const StyledShareContainer = styled.div`
    margin-top: 30px;
    width: 355px;
    box-sizing: border-box;
    padding: 0 25px;
    text-align: center;
`;

export const StyledCVPageContentDetailsContainer = styled(BasicDivContainer)`
    display: flex;
    flex-direction: row;
`;


export const StyledCVPageContentInformations = styled.div`
    background-color: #FFFFFFE5;
    padding: 30px;    
    display: block;
    max-width: 300px;
    margin-bottom: 30px;
    border-radius: 30px;
    margin-right: 30px;
    .subtitle {
        color: ${COLORS.primaryOrange};
        margin-bottom: 0;
        svg {
            width: 20px;
            margin-right: 5px;
        }
    }
    .content {
        padding-left: 30px;
        margin-top: 5px;
    }
`; 

export const StyledCVPageContentPassions  = styled.div`
    background-color: #FFFFFFE5;
    padding: 30px;    
    display: block;
    max-width: 300px;
    margin-bottom: 30px;
    border-radius: 30px;
    margin-right: 30px;
`;  

export const StyledCVPageContentExperience  = styled.div`
    background-color: #FFFFFFE5;
    padding: 30px;
    display: block;
    margin-bottom: 30px;
    border-radius: 30px;

`;  


export const StyledSkillTag = styled.div`
    display: inline-block;
    margin-right: 20px;
    padding: 3px 10px;
    border-radius: 5px;
    background-color: #F55F241A;
    border: #F55F241A 1px solid;
    color: ${COLORS.primaryOrange};
    font-size: 14px;
    font-weight: 600;
`;

export const StyledCVExperienceLi = styled.div`
    padding-bottom: 40px;
    padding-left: 14px;
    border-left: 1px solid #D4D4D4;
    position: relative;
    > div {
        margin: 0 0 18px;
    }
    ::before {
        content: '';
        height: 9px;
        width: 9px;
        border-radius: 9px;
        background-color: ${COLORS.primaryOrange};
        position: absolute;
        left: -5px;
        top: 2px;
    }
`;


export const StyledCVPageContentCarousel  = styled.div`
    max-width: 1320px;
    padding: 0 15px;
    margin: 30px auto;
    width: 100%;
    box-sizing: border-box;
`; 


export const StyledCVPageContentSlide = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    column-gap: 10px;
    font-size: 18px;
    line-height: 25px;
    text-align: center;
    > div {
        width: fit-content;
    }
    svg {
        color: ${COLORS.primaryOrange};
        width: 32px;
        height: 32px;
    }
    span {
        :first-of-type {
            svg {
                transform: translateY(-8px) rotate(180deg);
            }
        }
    }
`;


export const StyledCVPageContentFooter = styled.div`
    display: block;
    width: 100%;
    max-width: 1320px;
    box-sizing: border-box;
    padding: 0 15px 50px;
    text-align: center;
    p {
        margin-bottom: 0;
    }
    a {
        color: ${COLORS.primaryOrange};
        text-decoration: underline;
    }
`;