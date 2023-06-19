import styled from 'styled-components';
import { TdDesktop, TdMobile, TrMobile } from 'src/components/utils/Table';
import { COLORS } from 'src/constants/styles';

export const StyledNameCell = styled(TdDesktop)`
  border-left: solid 3px
    ${(props) => {
      return COLORS.cvStatus[props.cvStatus]?.border || COLORS.white;
    }} !important;

  .profileImage {
    margin-right: 15px;
  }
`;

export const StyledCVStatusCellContent = styled.div`
  padding-left: 24px;
  color: ${COLORS.black};
  position: relative;
  &::before {
    content: '';
    height: 10px;
    width: 10px;
    position: absolute;
    left: 0;
    top: calc(50% - 6px);
    border-radius: 12px;
    background-color: ${(props) => {
      return COLORS.cvStatus[props.cvStatus]?.background || COLORS.white;
    }};
    border: 2px solid
      ${(props) => {
        return COLORS.cvStatus[props.cvStatus]?.border || COLORS.white;
      }};
  }

  > span {
    white-space: nowrap;
  }
`;

export const StyledNoWrapCellContent = styled.div`
  > span {
    white-space: nowrap;
  }
`;

export const StyledEmployedCellContent = styled.div`
  .yes {
    color: ${COLORS.yesGreen};
  }
  .no {
    color: ${COLORS.noRed};
  }
`;

export const StyledHiddenCVCellContent = styled.div`
  color: ${COLORS.black};
  .eye-hidden {
    color: ${COLORS.darkGray};
  }
`;

export const StyledCheckBoxCellContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledMobileMember = styled(TrMobile)`
  .line {
    border-left: solid 3px
      ${(props) => {
        return COLORS.cvStatus[props.cvStatus]?.border || COLORS.white;
      }} !important;
  }
`;

export const StyledNameCellMobile = styled(TdMobile)`
  > .profileImage {
    margin-right: 15px;
  }
`;
