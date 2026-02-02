import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledStarRating = styled.div`
  justify-content: center;
  text-align: center;
  flex-direction: row;
  display: flex;
  cursor: pointer;

  .star,
  .activeStar {
    float: left;
    height: 25px;
    width: 25px;
    margin-right: 5px;
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .activeStar {
    color: ${COLORS.yellowSport};
  }

  input[type='radio'] {
    display: none;
  }
`;
