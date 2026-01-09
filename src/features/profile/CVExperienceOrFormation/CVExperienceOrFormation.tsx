import React from 'react';
import { Skill } from '@/src/api/types';
import { H5 } from '@/src/components/ui/Headings';
import { ButtonIcon } from '../../../components/ui';
import { LucidIcon } from '../../../components/ui/Icons/LucidIcon';
import { CVDate } from '../CVDate';
import { COLORS } from 'src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledCVExperience,
  StyledCVExperienceDate,
  StyledCVExperienceDateMobile,
  StyledCVExperienceDescription,
  StyledCVSkillTagContainer,
  StyledEditToolsContainer,
  StyledSkillTag,
} from './CVExperienceOrFormation.styles';

interface ExperienceOrFormationProps {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  structure?: string;
  skills: Skill[];
  isEditable?: boolean;
  editItem?: () => void;
  deleteItem?: () => void;
}

export function CVExperienceOrFormation({
  startDate,
  endDate,
  title,
  structure,
  location,
  description,
  skills,
  isEditable = false,
  editItem,
  deleteItem,
}: ExperienceOrFormationProps) {
  const isDesktop = useIsDesktop();

  return (
    <StyledCVExperience>
      {isDesktop && (
        <StyledCVExperienceDate>
          {startDate && (
            <CVDate experienceOrFormation={{ startDate, endDate }} />
          )}
        </StyledCVExperienceDate>
      )}
      <StyledCVExperienceDescription>
        {title && <H5 title={title} color={COLORS.black} />}
        {!isDesktop && (
          <StyledCVExperienceDateMobile>
            {startDate && (
              <CVDate experienceOrFormation={{ startDate, endDate }} isMobile />
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
            return <StyledSkillTag key={skillId}>{name}</StyledSkillTag>;
          })}
        </StyledCVSkillTagContainer>
      </StyledCVExperienceDescription>
      {isEditable && (
        <StyledEditToolsContainer>
          <ButtonIcon
            icon={<LucidIcon name="Pencil" />}
            onClick={() => {
              if (editItem) {
                editItem();
              }
            }}
          />
          <ButtonIcon
            icon={<LucidIcon name="Trash" />}
            onClick={() => {
              if (deleteItem) {
                deleteItem();
              }
            }}
          />
        </StyledEditToolsContainer>
      )}
    </StyledCVExperience>
  );
}
