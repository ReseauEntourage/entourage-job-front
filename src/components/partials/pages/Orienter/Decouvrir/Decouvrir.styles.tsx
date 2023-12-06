import styled from 'styled-components';

export const StyledDecouvrirContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: stretch;
  gap: 20%;
  width: 100%;
  max-width: 1080px;
  margin: 60px auto 40px;
`;

export const StyledDecouvrirCard = styled.div`
  width: 40%;
  border-radius: 40px;
  background-color: #fef8f5;
  .image-container {
    position: relative;
    height: 320px;
    img {
      border-radius: 40px 40px 0 0;
    }
  }
  .text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 30px;
    p {
      margin: 0 0 24px 0;
    }
  }
  &.mobile {
    width: 100%;
    margin-bottom: 40px;
  }
`;
