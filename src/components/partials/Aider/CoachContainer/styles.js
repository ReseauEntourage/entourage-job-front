import styled from 'styled-components';
// import { COLORS } from 'src/constants/styles';

export const StyledCoachContainer = styled.section`
  .picto-text-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 20px;
    .picto-text-content {
      display: flex;
      flex-direction: column;
      width: 20%;
      max-width: 340px;
      min-width: 200px;
      align-items: center;
      margin-bottom: 40px;
      .svg-container {
        min-height: 103px;
        margin-bottom: 24px;
      }
      p {
        color: #ffffff;
        text-align: center;
        margin: 0;
      }
    }
  }
  .coach-cta-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 0;
    text-align: center;
    h4 {
      margin: 0 0 8px;
      font-weight: 700;
      font-size: 18px;
    }
    p {
      margin: 0 0 36px;
      line-height: 20px;
    }
  }
`;
