import styled from 'styled-components';
import ChevronDownIcon from 'assets/icons/chevron-down.svg';
import { COLORS } from 'src/constants/styles';

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
    display: flex;
    max-width: 1320px;
    padding: 0 10px;

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
    color: ${COLORS.darkGray};
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

  margin: 26px 15px 0;
  h1 {
    text-transform: uppercase;
  }
`;

export const StyledHeaderDetails = styled.div`
  padding-left: 55px;
  line-height: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

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

  &.mobile {
    padding-left: 0;
    text-align: center;
    width: 100%;
    min-width: 300px;
  }
`;

export const StyledCVProfilePictureContainer = styled.div`
  max-width: 355px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  &.mobile {
    width: 100%;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

export const StyledCVProfilePicture = styled.div`
  height: 400px;
  width: 270px;
  margin-top: 8%;
  position: relative;
  .picture {
    height: 100%;
    width: 100%;
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
  }
  .pseudo {
    background-color: #f55f241a;
    height: 110%;
    width: 110%;
    left: 55%;
    transform: translateX(-50%) rotate(6.06deg);
    top: -8%;
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
        display: flex;
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
  margin-top: 38px;
  /* width: 355px; */

  padding: 0 25px;
  text-align: center;
  max-width: 100%;
`;

export const StyledCVPageContentDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 26px 15px 0;

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
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  border-radius: 30px;
  margin-right: 30px;

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
    margin-right: 0;
  }
`;

export const StyledCVPageContentPassions = styled.div`
  background-color: #ffffffe5;
  padding: 30px;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  border-radius: 30px;
  margin-right: 30px;
  position: relative;
  &.mobile {
    margin-right: 0;
  }
`;

export const StyledCVPageContentExperience = styled.div`
  background-color: #ffffffe5;
  padding: 30px;
  display: flex;
  flex-direction: column;
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
  margin: 30px auto;
  width: 100%;

  span.name {
    /* font-weight: 600; */
    color: ${COLORS.darkGray};
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
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1320px;

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

export const StyledChevronIcon = styled(ChevronDownIcon)`
  top: 30px;
  right: 30px;
  color: ${COLORS.primaryOrange};
  svg {
    height: 20px;
    width: 20px;
  }
`;

export const StyledCVMessageContainer = styled.div`
  margin-top: 38px;
  &.mobile {
    button {
      margin: auto;
      display: flex;
    }
  }
`;
