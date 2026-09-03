import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledStaffContactContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const StyledStaffContactPicture = styled.div`
  border-radius: 50%;
  overflow: hidden;
  width: 120px;
  height: 120px;
  position: relative;
  margin-bottom: 12px;
`;

export const StyledStaffContactNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledStaffContactName = styled.div`
  text-align: center;

  > * {
    margin-bottom: 0;
  }
`;

export const StyledStaffContactRole = styled.div`
  text-align: center;
`;
export const StyledStaffContactMail = styled.div`
  text-align: center;
  a {
    color: ${COLORS.black};
    text-decoration: underline;
  }
`;

export const StyledStaffContactText = styled.div`
  text-align: center;
`;

export const StyledStaffContactCompact = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: ${COLORS.hoverBlue};
  text-align: left;
`;

export const StyledStaffContactCompactPicture = styled.div`
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  width: 48px;
  height: 48px;
  position: relative;
`;
