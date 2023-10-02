import React from 'react';
import { CVDate } from '../CVDate';
import { StyledCVSkillTagContainer } from 'src/components/partials/CV/PageCVContent/PageCVContent.styles';
import {
  StyledCVPDFExperienceDate,
  StyledCVPDFExperienceDescription,
  StyledCVPDFExperienceLi,
  StyledCVPDFTitle,
  StyledCVPFSkillTag,
} from './CVPDF.styles';

interface ExperienceOrFormationPDFProps {
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

export function ExperienceOrFormationPDF({
  dateStart,
  dateEnd,
  title,
  structure,
  location,
  description,
  skills,
}: ExperienceOrFormationPDFProps) {
  return (
    <StyledCVPDFExperienceLi>
      <StyledCVPDFExperienceDate>
        {dateStart && <CVDate experienceOrFormation={{ dateStart, dateEnd }} />}
      </StyledCVPDFExperienceDate>
      <StyledCVPDFExperienceDescription>
        {title && <StyledCVPDFTitle>{title}</StyledCVPDFTitle>}
        {(structure || location) && (
          <div className="name-gray">
            {structure}
            {structure && location && ' - '}
            {location}
          </div>
        )}
        {description && <div>{description}</div>}
        <StyledCVSkillTagContainer>
          {skills.map(({ name, id: skillId }) => {
            return (
              <StyledCVPFSkillTag key={skillId}>{name}</StyledCVPFSkillTag>
            );
          })}
        </StyledCVSkillTagContainer>
      </StyledCVPDFExperienceDescription>
    </StyledCVPDFExperienceLi>
  );
}
