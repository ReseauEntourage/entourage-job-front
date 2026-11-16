import { styled } from 'styled-components';
import { Button } from '@/src/components/ui/Button';
import { marginLargeTop } from '@/src/styles/margins';

export const StyledMerciButtonContainer = styled.div`
  margin-top: 40px;
`;

/** Button with a 40px top margin. */
export const StyledMerciButton = styled(Button)`
  ${marginLargeTop}
`;
