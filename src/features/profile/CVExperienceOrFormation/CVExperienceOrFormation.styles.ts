import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCVExperience = styled.div`
  display: flex;
  gap: 40px;
  flex: 1;
  white-space: pre-line;
`;

export const StyledCVExperienceCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex: 1;
  white-space: pre-line;
  border: 1px solid ${COLORS.gray};
  border-radius: 10px;
  padding: 16px;
`;

export const StyledCVExperienceCardMain = styled.div`
  min-width: 0;
  flex: 1;
  color: ${COLORS.darkGray};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledCVExperienceCardMeta = styled.div`
  color: ${COLORS.darkGray};
`;

export const StyledCVExperienceDate = styled.div`
  width: 130px;
  color: ${COLORS.darkGray};
  text-align: right;
  flex-shrink: 0;
`;

export const StyledCVExperienceDateMobile = styled.div`
  color: ${COLORS.darkGray};
  text-align: left;
  font-size: 13px;
`;

export const StyledCVExperienceDescription = styled.div`
  display: flex;
  flex: auto;
  flex-direction: column;
  gap: 5px;
  position: relative;
  color: ${COLORS.darkGray};
  border-left: 1px solid ${COLORS.gray};
  padding-left: 20px;
  padding-bottom: 30px;

  ::before {
    content: '';
    height: 9px;
    width: 9px;
    border-radius: 9px;
    background-color: ${COLORS.primaryBlue};
    position: absolute;
    left: -5px;
    top: 14px;
  }
`;

export const StyledCVSkillTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
`;

export const StyledSkillTag = styled.div`
  display: inline-block;
  margin-right: 20px;
  padding: 3px 10px;
  border-radius: 5px;
  background-color: ${COLORS.hoverBlue};
  border: ${COLORS.hoverBlue} 1px solid;
  color: ${COLORS.primaryBlue};
  font-size: 14px;
  font-weight: 400;
`;

export const StyledEditToolsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
`;

export const StyledEditToolsContainerCard = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;
