import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const Container = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: -webkit-sticky;
  position: sticky;
  top: 108px;
`;

export const Scroll = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`;

export const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  background-color: ${COLORS.white};
  padding: 20px;
`;

export const TitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ContentContainer = styled.div`
  position: relative;
  min-height: 200px;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
`;

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 5px;
  background-color: ${COLORS.lightgray};
`;

export const DetailsContentContainer = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
  background-color: ${COLORS.white};
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;
