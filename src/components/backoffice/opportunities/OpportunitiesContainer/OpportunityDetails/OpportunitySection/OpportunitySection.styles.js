import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 40px;
  }
`;

export const TitleContainer = styled.div`
  flex: 1;
  flex-direction: column;
  border-bottom: 1px ${COLORS.primaryOrange} solid;
`;

export const ContentContainer = styled.div`
  margin-top: 12px;
`;
