import React from 'react';
import {
  StyledCVExperienceDate,
  StyledCVExperienceDateMobile,
  StyledCVExperienceDescription,
  StyledCVExperienceLi,
  StyledCVSkillTagContainer,
} from 'src/components/partials/CV/PageCVContent/PageCVContent.styles';
import { Tag } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { COLORS } from 'src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';
import { CVDate } from './CVDate';

interface ExperienceOrFormationProps {
  title: string;
  description: string;

  dateStart: Date;
  dateEnd: Date;

  location: string;
  structure: string;
  skills: {
    id?: string;
    name: string;
    order: number;
  }[];
}

export function CVExperienceOrFormation({
  dateStart,
  dateEnd,
  title,
  structure,
  location,
  description,
  skills,
}: ExperienceOrFormationProps) {
  const isDesktop = useIsDesktop();

  return (
    <StyledCVExperienceLi>
      {isDesktop && (
        <StyledCVExperienceDate>
          {dateStart && (
            <CVDate experienceOrFormation={{ dateStart, dateEnd }} />
          )}
        </StyledCVExperienceDate>
      )}
      <StyledCVExperienceDescription>
        {title && <H5 title={title} color={COLORS.black} />}
        {!isDesktop && (
          <StyledCVExperienceDateMobile>
            {dateStart && (
              <CVDate experienceOrFormation={{ dateStart, dateEnd }} isMobile />
            )}
          </StyledCVExperienceDateMobile>
        )}
        {(structure || location) && (
          <div className="name-gray">
            {structure}
            {structure && location && ' - '}
            {location}
          </div>
        )}
        {description && <div>{description}</div>}
        <StyledCVSkillTagContainer>
          {skills?.map(({ name, id: skillId }) => {
            return <Tag key={skillId} content={name} />;
          })}
        </StyledCVSkillTagContainer>
      </StyledCVExperienceDescription>
    </StyledCVExperienceLi>
  );
}
