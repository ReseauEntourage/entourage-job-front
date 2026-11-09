import { styled } from 'styled-components';
import { Grid } from '@/src/components/ui';
import { marginLargeTop } from '@/src/styles/margins';

export const StyledAssociationEntourageImageContainer = styled.div`
  height: 300px;
  overflow: hidden;
  position: relative;
`;

export const StyledAssociationEntourageButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`;

export const StyledAssociationEntourageGrid = styled(Grid)`
  ${marginLargeTop}
`;
