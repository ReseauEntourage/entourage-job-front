import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

// Main container for both types
export const StyledRecruitementAlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  padding: 0;
  margin: 0;
`;

// No alerts container
export const StyledEmptyRecruitementAlertContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

// Main container for the company recruitment alert
export const StyledCompanyRecruitementAlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  border-radius: 20px;
  background-color: ${COLORS.hoverBlue};
  gap: 16px;
  margin: 0;
  overflow: hidden;
`;

export const StyledAlertHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const StyledBadgesContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledAlertDescription = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
`;

export const StyledCandidatesInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
`;

export const StyledSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  /* spinner */
  > div {
    width: 24px !important;
    height: 24px !important;
  }
`;

export const StyledCandidatesAvatars = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
`;

export const StyledAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: -12px; /* Overlap effect */
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  padding: 0;
  overflow: hidden;

  > div {
    width: 100% !important;
    height: 100% !important;
    margin: 0;
    padding: 0;
  }
`;

export const StyledBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 14px;
  color: ${COLORS.darkGray};
  background-color: ${COLORS.white};
`;

export const StyledCandidatesCount = styled.span`
  font-size: 14px;
`;

export const StyledViewCandidatesLink = styled.a`
  font-size: 14px;
  font-weight: 700;
  text-decoration: underline;
  margin-left: auto;
  cursor: pointer;
  color: ${COLORS.black};

  &:hover {
    text-decoration: none;
  }
`;
