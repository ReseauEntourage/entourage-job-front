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
  overflow: hidden; /* Empêche le débordement du contenu */
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

  /* Ajuster la taille du spinner */
  > div {
    width: 24px !important;
    height: 24px !important;
  }
`;

export const StyledCandidatesAvatars = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  /* background-color: ${({ theme }) => theme.colors.primaryBlue}; */
  margin-right: -8px;
  /* border: 2px solid ${({ theme }) => theme.colors.lightgray}; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

export const StyledBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 14px;
  color: ${COLORS.darkGray};
  background-color: ${COLORS.white};
  /* margin-right: 4px;
  margin-bottom: 4px; */
`;

export const StyledCandidatesCount = styled.span`
  font-size: 14px;
  /* color: ${({ theme }) => theme.colors.darkGray}; */
`;

export const StyledViewCandidatesLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  /* color: ${({ theme }) => theme.colors.primaryBlue}; */
  text-decoration: underline;
  margin-left: auto;

  &:hover {
    text-decoration: none;
  }
`;
