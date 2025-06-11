import React from 'react';
import { CVDate } from '../CVDate';
import { StyledCVSkillTagContainer } from '../CVExperienceOrFormation/CVExperienceOrFormation.styles';
import {
  StyledCVPDFExperienceDate,
  StyledCVPDFExperienceDescription,
  StyledCVPDFExperienceLi,
  StyledCVPDFXpFormaTitle,
  StyledCVPFSkillTag,
} from './CVPDF.styles';

interface ExperienceOrFormationPDFProps {
  title: string;
  description: string;

  startDate: string;
  endDate: string;

  location: string;
  structure: string;
  skills: {
    id?: string;
    name: string;
    order: number;
  }[];
}

export function CVExperienceOrFormationPDF({
  startDate,
  endDate,
  title,
  structure,
  location,
  description,
  skills,
}: ExperienceOrFormationPDFProps) {
  return (
    <StyledCVPDFExperienceLi>
      <StyledCVPDFExperienceDate>
        {startDate && <CVDate experienceOrFormation={{ startDate, endDate }} />}
      </StyledCVPDFExperienceDate>
      <StyledCVPDFExperienceDescription>
        {title && <StyledCVPDFXpFormaTitle>{title}</StyledCVPDFXpFormaTitle>}
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
