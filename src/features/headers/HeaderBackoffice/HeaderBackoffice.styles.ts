import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledHeaderBackOffice = {
  Container: styled.div`
    display: flex;
    flex-direction: row;
  `,
  LeftColumn: styled.div`
    display: flex;
    flex-direction: column;
    flex: auto;
    gap: 8px;
  `,
  RightColumn: styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
  `,
};

export const StyledBackgroundedHeaderBackoffice = styled.div`
  background-color: ${COLORS.lightGray};
`;
