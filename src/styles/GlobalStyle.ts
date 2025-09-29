import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: Poppins, sans-serif;
  }

  button, input, select, textarea, span {
    font-family: inherit;
  }
`;
