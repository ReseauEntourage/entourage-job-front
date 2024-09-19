import styled from 'styled-components';
import {
  StyledCVExperienceDate,
  StyledCVExperienceDescription,
  StyledCVExperienceLi,
  StyledCVPageContentDetailsContainer,
  StyledCVPageContentExperience,
  StyledCVPageContentHeader,
  StyledCVPageContentInformations,
  StyledCVPageContentPassions,
  StyledCVPageContentStory,
  StyledCVProfilePicture,
  StyledCVProfilePictureContainer,
  StyledSkillTag,
} from 'src/components/partials/CV/PageCVContent/PageCVContent.styles';
import { COLORS } from 'src/constants/styles';

export const StyledCVPDFPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledCVPDFContentHeader = styled(StyledCVPageContentHeader)`
  margin: 10px 10px 0 10px !important;
  padding: 10px 10px 10px 0 !important;

  #header-details {
    padding-left: 0;
  }
`;

export const StyledCVPDFContentDetailsContainer = styled(
  StyledCVPageContentDetailsContainer
)`
  margin: 0 10px !important;
  padding: 0 !important;
`;

export const StyledCVPDFQuote = styled.div`
  width: 105px;
  margin-top: 12px;
  text-align: center;
  font-size: 8px;
  line-height: 10px;
  position: relative;
  align-self: center;

  svg {
    color: ${COLORS.primaryBlue};
    height: 10px;
    width: 15px;
    position: absolute;

    :first-of-type {
      left: -15px;
      top: -5px;
      margin-right: 8px;
    }

    :last-of-type {
      margin-left: 8px;
      right: -15px;
      bottom: -5px;
    }
  }
`;

export const StyledCVPDFContentPassions = styled(StyledCVPageContentPassions)`
  padding: 10px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 0;
  margin-top: 10px;

  p {
    color: ${COLORS.darkGrayFont};
    font-size: 10px;
  }
`;

export const StyledCVPDFStory = styled(StyledCVPageContentStory)`
  margin-top: 10px;
  margin-bottom: 10px;

  p {
    font-size: 10px;
    line-height: 12px;
  }
`;

export const StyledCVPDFExperienceLi = styled(StyledCVExperienceLi)`
  padding-left: 0;

  > div {
    padding: 0px 15px 10px;
  }

  &:last-child {
    > div {
      padding-bottom: 0;
    }
  }
`;

export const StyledCVPDFExperienceDescription = styled(
  StyledCVExperienceDescription
)`
  font-size: 8px;
  line-height: 10px;

  > div {
    margin-bottom: 5px;
  }

  padding-right: 0 !important;

  ::before {
    top: 0;
  }
`;

export const StyledCVPFSkillTag = styled(StyledSkillTag)`
  font-size: 8px;
  line-height: 10px;
  padding: 2px 5px;
  margin-right: 5px;
`;

export const StyledCVPDFExperienceDate = styled(StyledCVExperienceDate)`
  min-width: 95px;
  max-width: 90px;
  font-size: 10px;
  padding-right: 15px;
  padding-left: 0 !important;
  line-height: 12px;
`;

export const StyledCVPDFContentExperience = styled(
  StyledCVPageContentExperience
)`
  padding: 10px 20px;
  border-radius: 20px;
  margin: 10px 0;

  > ul {
    margin-top: 10px !important;
  }
`;

export const StyledCVPDFContentInformations = styled(
  StyledCVPageContentInformations
)`
  padding: 10px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 0;
  margin-top: 10px;

  .subtitle {
    color: ${COLORS.darkGray};
    font-size: 10px;
    display: flex;
    align-items: center;

    svg {
      color: ${COLORS.primaryBlue};
      height: 10px !important;
      width: 10px !important;
      margin-right: 5px;
    }
  }

  .content {
    font-size: 10px;
    padding-left: 13px;
    margin-top: 0;
  }
`;

export const StyledCVPDFH1 = styled.h1`
  font-size: 25px;
  line-height: 30px;
  margin-bottom: 8px;
  text-transform: capitalize;
  font-weight: 700;
`;

export const StyledCVPDFCareerPath = styled.div`
  font-size: 10px !important;
  line-height: 12px !important;
`;

export const StyledCVPDFTitle = styled.h6`
  font-size: 12px;
  line-height: 14px;
  font-weight: 700;
  margin-bottom: 5px;
`;

export const StyledCVPDFXpFormaTitle = styled.h6`
  font-size: 10px;
  line-height: 12px;
  font-weight: 700;
  margin-bottom: 5px;
`;

export const StyledCVPDFPage = styled.div`
  height: 1122px;
  width: 794px;
  margin-bottom: 50px;
  background-color: ${COLORS.lightgray};
  display: flex;
  flex-direction: column;

  ul {
    margin: 0;
    padding-left: 0;

    li {
      list-style: none;
    }
  }

  p {
    margin: 0;
  }

  .name-gray {
    color: ${COLORS.darkGray};
  }
`;

export const StyledCVPDFProfilePicture = styled(StyledCVProfilePicture)`
  width: 128px;
  height: 128px;
  margin-top: ${({ verticalMargin }) => {
    return verticalMargin ? '20px' : 0;
  }};
  margin-bottom: ${({ verticalMargin }) => {
    return verticalMargin ? '10px' : 0;
  }};
`;

export const StyledCVPDFProfilePictureContainer = styled(
  StyledCVProfilePictureContainer
)`
  padding-right: 10px;
  padding-left: 10px;
  margin-right: 10px;
  height: 100%;
  align-items: flex-start;
`;
