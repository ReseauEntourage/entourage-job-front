import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

export const DetailsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

export const RightContainer = styled.div`
  flex: 3;
  padding-left: 24px;
`;

export const BackLink = styled.a`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  color: ${COLORS.darkGray};
`;
