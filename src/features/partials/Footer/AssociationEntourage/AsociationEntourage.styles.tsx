import { styled } from 'styled-components';
import { Grid } from '@/src/components/ui';
import { lightOnDark } from '@/src/styles/lightOnDark';
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

export const StyledAssociationEntourageContent = styled.div`
  text-align: center !important;
`;

/** Text block laid on the dark background of the section. */
export const StyledAssociationEntourageLight = styled.div`
  ${lightOnDark}
`;
