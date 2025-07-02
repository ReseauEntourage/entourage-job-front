import styled from 'styled-components';
import { TdDesktop, TdMobile, TrMobile } from 'src/components/utils/Table';
import { COLORS } from 'src/constants/styles';

export const StyledNameCell = styled(TdDesktop)`
  border-left: solid 3px ${COLORS.white} !important;
  .profileImage {
    margin-right: 15px;
  }
`;

export const StyledNoWrapCellContent = styled.div`
  > span {
    white-space: nowrap;
  }
`;

export const StyledEmployedCellContent = styled.div`
  .yes {
    color: ${COLORS.green};
  }
  .no {
    color: ${COLORS.red};
  }
`;

export const StyledCheckBoxCellContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledMobileMember = styled(TrMobile)`
  .line {
    border-left: solid 3px ${COLORS.white} !important;
  }
`;

export const StyledNameCellMobile = styled(TdMobile)`
  > .profileImage {
    margin-right: 15px;
  }
`;
