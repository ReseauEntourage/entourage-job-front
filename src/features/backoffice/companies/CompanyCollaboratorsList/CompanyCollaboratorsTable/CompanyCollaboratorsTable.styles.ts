import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledMobileCollaboratorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const StyledMobileCollaboratorItem = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${COLORS.gray};
  border-radius: 30px;
  padding: 20px;
  gap: 20px;
`;

export const StyledMobileCollaboratorItemField = styled.div`
  display: flex;
  flex-direction: column;
`;
