import { styled } from 'styled-components';
import { Button } from '@/src/components/ui';

export const StyledEntreprisesEnSavoirPlusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

/** Button with a 10px top margin. */
export const StyledContactButton = styled(Button)`
  margin-top: 10px !important;
`;
