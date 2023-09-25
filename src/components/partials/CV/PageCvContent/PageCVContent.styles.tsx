import styled from 'styled-components';
import { Icon } from 'src/components/utils';
import { COLORS } from 'src/constants/styles';

export const CV_COLORS = {
  titleGray: '#484848',
  nameGray: '#979797',
};

export const StyledBackLink = styled.a`
  display: flex !important;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  color: ${COLORS.darkGrayFont} !important;
  &:visited {
    color: ${COLORS.darkGrayFont} !important;
  }
  svg {
    width: 8px;
    fill: ${COLORS.darkGrayFont};
  }
`;

export const StyledCVPageContent = styled.div`
  background-color: ${COLORS.wheat};
  display: flex;
  flex-direction: column;
  max-width: 1320px;
  margin: auto;
  color: #484848;
  font-size: 14px;
  > a {
    margin: 26px auto 0;
    color: black;
    font-size: 14px;
    line-height: 16px;
    width: 100%;
    display: block;
    max-width: 1320px;
    padding: 0 10px;
    box-sizing: border-box;
    :hover {
      color: ${COLORS.primaryOrange};
    }
  }
  p {
    color: ${COLORS.darkGrayFont};
  }

  .strong {
    font-weight: 700;
  }
  ul {
    padding-left: 0;
    list-style: none;
    margin-bottom: 0;
    > p:last-child {
      margin-bottom: 0;
    }
    > li:last-child p {
      margin-bottom: 0;
    }
  }
  .mobile {
    .close {
      h2 {
        margin-bottom: 0;
      }
      svg {
        transform: rotate(180deg);
      }
      ul {
        display: none;
      }
    }
  }
  .name-gray {
    color: ${CV_COLORS.nameGray};
  }
`;

export const StyledCVPageContentHeader = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  background-color: #ffffffe5;
  border-radius: 30px;
  padding: 30px;
  box-sizing: border-box;
  margin: 26px 15px 0;
  h1 {
    text-transform: uppercase;
  }
  #header-details {
    padding-left: 55px;
    line-height: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    box-sizing: border-box;
    #quote {
      svg {
        width: 18px;
        color: ${COLORS.primaryOrange};
        :first-of-type {
          margin-right: 8px;
          transform: translateY(-8px);
        }
        :last-of-type {
          margin-left: 8px;
          transform: translateY(8px);
        }
      }
    }
  }
  #header-picture-share {
    max-width: 355px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &.mobile {
    #header-picture-share {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    #header-details {
      padding-left: 0;
      text-align: center;
      width: 100%;
      min-width: 300px;
    }
  }
`;

export const StyledCVProfilePicture = styled.div`
  height: 450px;
  width: 355px;
  position: relative;
  .picture {
    height: 400px;
    width: 270px;
    border-radius: 859px 909px 729px 909px;
    background-image: ${(props) => {
      return `url('${props.imgSrc}')`;
    }};
    background-position: 66% 39%;
    position: absolute;
    z-index: 2;
    background-size: cover;
    left: 50%;
    transform: translateX(-50%);
    top: 25px;
  }
  .pseudo {
    background-color: #f55f241a;
    height: 450px;
    width: 300px;
    left: 50%;
    transform: translateX(-50%) rotate(7.94deg);
    top: 0;
    position: absolute;
    border-radius: 859px 909px 729px 909px;
    z-index: 1;
  }
  &.mobile {
    max-width: 100%;
    height: 300px;
    margin-bottom: 30px;
    .picture {
      width: 190px;
      height: 270px;
      left: 50%;
      transform: translateX(-50%);
    }
    .pseudo {
      height: 300px;
      width: 200px;
      left: 50%;
      transform: translateX(-50%) rotate(7.94deg);
    }
  }
`;

export const StyledCVPageContentStory = styled.div`
  margin-bottom: 20px;
  position: relative;
  white-space: pre-line;
  color: ${COLORS.darkGrayFont};
  p {
    margin-bottom: 0;
  }
  &.mobile-hidden {
    max-height: 200px;
    overflow-y: hidden;
    margin-bottom: 50px;
    .seeMore {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 70px;
      background: linear-gradient(#ffffff48, #ffffffe5 90%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      line-height: 30px;
      > div {
        display: block;
        margin: 0 auto;
        color: ${COLORS.primaryOrange};
        border-bottom: ${COLORS.primaryOrange} solid 1px;
        :hover {
          cursor: pointer;
        }
      }
    }
  }
`;

export const StyledShareContainer = styled.div`
  margin-top: 30px;
  /* width: 355px; */
  box-sizing: border-box;
  padding: 0 25px;
  text-align: center;
  max-width: 100%;
`;

export const StyledCVPageContentDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 26px 15px 0;
  box-sizing: border-box;
  flex: 1 1 0%;
  &.mobile {
    flex-direction: column;
    > div {
      min-width: unset;
    }
  }
`;

export const StyledLeftColumn = styled.div`
  flex: 1;
`;

export const StyledRightColumn = styled.div`
  flex: 3;
`;

export const StyledTitleAccordion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > h2 {
    margin-bottom: 0;
  }
`;

export const StyledCVPageContentInformations = styled.div`
  background-color: #ffffffe5;
  padding: 30px;
  display: block;
  max-width: 300px;
  margin-bottom: 30px;
  border-radius: 30px;
  margin-right: 30px;
  box-sizing: border-box;
  position: relative;
  h6 {
    margin-block-start: 0;
  }
  .subtitle {
    display: flex;
    align-items: center;
    color: ${COLORS.primaryOrange};
    margin-bottom: 0;
    svg {
      width: 16px;
      margin-right: 8px;
    }
  }
  .content {
    padding-left: 30px;
    margin-top: 5px;
  }
  &.mobile {
    width: 100%;
    max-width: none;
  }
`;

export const StyledCVPageContentPassions = styled.div`
  background-color: #ffffffe5;
  padding: 30px;
  display: block;
  max-width: 300px;
  margin-bottom: 30px;
  border-radius: 30px;
  margin-right: 30px;
  box-sizing: border-box;
  position: relative;
  &.mobile {
    width: 100%;
    max-width: none;
  }
`;

export const StyledCVPageContentExperience = styled.div`
  background-color: #ffffffe5;
  padding: 30px;
  display: block;
  margin-bottom: 30px;
  border-radius: 30px;
  position: relative;
  font-size: 16px;
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
  background-color: #f55f241a;
  border: #f55f241a 1px solid;
  color: ${COLORS.primaryOrange};
  font-size: 14px;
  font-weight: 400;
`;

export const StyledCVExperienceLi = styled.div`
  padding-left: 14px;
  white-space: pre-line;
  display: flex;
  :last-child {
    padding-bottom: 0;
  }
  > div {
    display: inline-block;
    vertical-align: top;
    padding: 10px 15px;
  }
`;

export const StyledCVExperienceDate = styled.div`
  min-width: 150px;
  max-width: 150px;
  padding: 0 15px;
  color: ${COLORS.darkGrayFont};
  text-align: right;
`;

export const StyledCVExperienceDateMobile = styled.div`
  color: ${COLORS.darkGrayFont};
  text-align: left;
  font-size: 13px;
`;

export const StyledCVExperienceDescription = styled.div`
  position: relative;
  border-left: 1px solid #d4d4d4;
  padding-bottom: 20px;
  color: ${COLORS.darkGrayFont};

  > div,
  h5 {
    margin-bottom: 10px;
  }
  ::before {
    content: '';
    height: 9px;
    width: 9px;
    border-radius: 9px;
    background-color: ${COLORS.primaryOrange};
    position: absolute;
    left: -5px;
    top: 14px;
  }
`;

export const StyledCVPageContentCarousel = styled.div`
  max-width: 1320px;
  padding: 0 15px;
  margin: 30px auto;
  width: 100%;
  box-sizing: border-box;
  span.name {
    /* font-weight: 600; */
    color: ${CV_COLORS.nameGray};
  }
`;

export const StyledCVPageContentSlide = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  column-gap: 10px;
  font-size: 18px;
  line-height: 25px;
  text-align: center;
  > div {
    width: fit-content;
  }
  padding-top: 4px;
  padding-bottom: 4px;
  svg {
    color: ${COLORS.primaryOrange};
    width: 32px;
    height: 32px;
  }
`;

export const StyledRightQuoteContainer = styled.div`
  display: flex;
  align-items: flex-end;
  svg {
    margin-left: 8px;
    transform: translateY(8px);
  }
`;

export const StyledLeftQuoteContainer = styled.div`
  display: flex;
  align-items: flex-start;
  svg {
    margin-right: 8px;
    transform: translateY(-8px);
  }
`;

export const StyledCVPageContentFooter = styled.div`
  display: block;
  width: 100%;
  max-width: 1320px;
  box-sizing: border-box;
  padding: 0 15px 50px;
  text-align: center;
  p {
    margin-bottom: 0;
  }
  a {
    color: ${COLORS.primaryOrange};
    text-decoration: underline;
  }
`;

export const StyledChevronIcon = styled(Icon)`
  top: 30px;
  right: 30px;
  svg {
    height: 20px;
    width: 20px;
    color: ${COLORS.primaryOrange};
  }
`;

export const StyledCVMessageContainer = styled.div`
  margin-top: 30px;
  &.mobile {
    button {
      margin: auto;
      display: block;
    }
    margin-bottom: 50px;
  }
`;
