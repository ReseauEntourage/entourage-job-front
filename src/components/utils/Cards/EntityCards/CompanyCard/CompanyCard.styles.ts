import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledCompanyCardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  position: relative;
  min-height: 345px;
`;

export const StyledCompanyMainInfosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: auto;
`;

export const StyledCompanyCardPictureContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 40px;
  overflow: hidden;
`;

export const StyledCompanyCardSectorsSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledCompanyCardSectorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledCompanyCardSeparator = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${COLORS.gray};
`;

export const StyledCompanyCardCollaboratorsSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 7px;
`;

export const StyledCompanyCardCtaContainer = styled.div`
  display: block;
  width: 100%;
`;
