import styled from 'styled-components';

const LIST_GAP = 25;
const MIN_CARD_WIDTH = '500px';
const MAX_CARD_WIDTH = '1fr';

export const StyledOnboardingElearningUnitCardList = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${MIN_CARD_WIDTH}, ${MAX_CARD_WIDTH})
  );
  gap: ${LIST_GAP}px;
`;
