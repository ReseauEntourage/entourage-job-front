import styled from 'styled-components';

export const StyledFooterForm = styled.div`
  .cta-container {
    padding-top: 24px;
    max-width: 440px;
    display: block;
    margin: 0 auto;
    > div {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        button:last-child {
            margin-left: 20px;
        }
    }
  }
`;
