import styled from 'styled-components';
import {
  StyledCVProfilePicture,
  StyledCVPageContentStory,
  StyledCVPageContentInformations,
  StyledCVPageContentExperience,
  StyledCVExperienceLi,
  StyledCVExperienceDate,
  StyledCVExperienceDescription,
  StyledSkillTag,
  StyledCVPageContentPassions,
  StyledCVPageContentHeader,
  StyledCVPageContentDetailsContainer,
} from 'src/components/partials/CV/PageCvContent/PageCVContent.styles';
import { COLORS } from 'src/constants/styles';

export const CV_COLORS = {
  titleGray: '#484848',
  parGray: '#6D6C6C',
  nameGray: '#979797',
};
export const StyledCVPDFContentHeader = styled(StyledCVPageContentHeader)`
  margin: 10px 10px 0 10px !important;
  padding: 15px 20px !important;
`;

export const StyledCVPDFContentDetailsContainer = styled(
  StyledCVPageContentDetailsContainer
)`
  margin: 0 10px !important;
  padding: 0 !important;
`;

export const StyledCVPDFQuote = styled.div`
  width: 105px;
  margin-top: 20px;
  text-align: center;
  font-size: 8px;
  line-height: 10px;
  position: relative;
  span.uk-icon {
    color: ${COLORS.primaryOrange};
    height: 15px;
    width: 15px;
    position: absolute;
    :first-of-type {
      left: -15px;
      top: 0;
      margin-right: 8px;
      svg {
        transform: translateY(-8px) rotate(180deg);
      }
    }
    :last-of-type {
      margin-left: 8px;
      right: -15px;
      bottom: 0;
      svg {
        transform: translateY(8px);
      }
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
  > div {
    padding: 0px 15px 10px;
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
  min-width: 105px;
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
    color: ${CV_COLORS.nameGray};
    font-size: 10px;
    .uk-icon {
      color: ${COLORS.primaryOrange};
      svg {
        height: 8px;
        width: 8px;
        margin-right: 5px;
      }
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
  font-size: 10px;
  line-height: 12px;
  font-weight: 700;
  margin-bottom: 5px;
`;

export const StyledCVPDFPage = styled.div`
  height: 1122px;
  width: 794px;
  margin-bottom: 50px;
  background-color: ${COLORS.wheat};
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
    color: ${CV_COLORS.nameGray};
  }
`;

export const StyledCVPDFProfilePicture = styled(StyledCVProfilePicture)`
  display: block;
  margin: auto;
  width: 105px;
  height: 190px;
  position: relative;
  .picture {
    width: 105px;
    height: 190px;
    border-radius: 859px 909px 729px 909px;
    background-image: ${(props) => {
      return `url('${props.imgSrc}')`;
    }};
    background-position: 66% 39%;
    position: unset;
    background-size: cover;
    transform: unset;
  }
  .pseudo {
    display: none;
  }
`;
