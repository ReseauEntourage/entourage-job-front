import React, { useCallback, useMemo } from 'react';
import { Skill } from '@/src/api/types';
import { H5 } from '@/src/components/ui/Headings';
import { ButtonIcon } from '../../../components/ui';
import { LucidIcon } from '../../../components/ui/Icons/LucidIcon';
import { CVDate, formatDate } from '../CVDate';
import { COLORS } from 'src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledCVExperience,
  StyledCVExperienceDate,
  StyledCVExperienceDateMobile,
  StyledCVExperienceDescription,
  StyledCVExperienceCard,
  StyledCVExperienceCardMain,
  StyledCVExperienceCardMeta,
  StyledCVSkillTagContainer,
  StyledEditToolsContainer,
  StyledEditToolsContainerCard,
  StyledSkillTag,
  StyledCVExperienceOrFormationDescriptionContainer,
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
  variant?: 'card' | 'timeline';
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
  variant = 'card',
}: ExperienceOrFormationProps) {
  const isDesktop = useIsDesktop();

  const handleEdit = useCallback(() => {
    editItem?.();
  }, [editItem]);

  const handleDelete = useCallback(() => {
    deleteItem?.();
  }, [deleteItem]);

  const structureLocationLine = useMemo(() => {
    if (!structure && !location) {
      return null;
    }
    return `${structure ?? ''}${structure && location ? ' - ' : ''}${
      location ?? ''
    }`;
  }, [location, structure]);

  const dateRangeLine = useMemo(() => {
    if (!startDate) {
      return null;
    }

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Aujourd'hui";
    return `${start} - ${end}`;
  }, [endDate, startDate]);

  if (variant === 'card') {
    return (
      <StyledCVExperienceCard>
        <StyledCVExperienceCardMain>
          {title && <H5 title={title} color={COLORS.black} />}
          {structureLocationLine && (
            <StyledCVExperienceCardMeta>
              <LucidIcon name="Building" size={14} />
              {structureLocationLine}
            </StyledCVExperienceCardMeta>
          )}
          {dateRangeLine && (
            <StyledCVExperienceCardMeta>
              <LucidIcon name="Calendar" size={14} />
              {dateRangeLine}
            </StyledCVExperienceCardMeta>
          )}
          {description && (
            <StyledCVExperienceOrFormationDescriptionContainer>
              {description}
            </StyledCVExperienceOrFormationDescriptionContainer>
          )}
          {skills?.length > 0 && (
            <StyledCVSkillTagContainer>
              {skills.map(({ name, id: skillId }) => {
                return <StyledSkillTag key={skillId}>{name}</StyledSkillTag>;
              })}
            </StyledCVSkillTagContainer>
          )}
        </StyledCVExperienceCardMain>

        {isEditable && (
          <StyledEditToolsContainerCard>
            <ButtonIcon
              icon={<LucidIcon name="Pencil" />}
              onClick={handleEdit}
              color={COLORS.darkGray}
            />
            <ButtonIcon
              icon={<LucidIcon name="Trash" />}
              onClick={handleDelete}
              color={COLORS.darkGray}
            />
          </StyledEditToolsContainerCard>
        )}
      </StyledCVExperienceCard>
    );
  }

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
        {structureLocationLine && (
          <StyledCVExperienceCardMeta>
            {structureLocationLine}
          </StyledCVExperienceCardMeta>
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
          <ButtonIcon icon={<LucidIcon name="Pencil" />} onClick={handleEdit} />
          <ButtonIcon
            icon={<LucidIcon name="Trash" />}
            onClick={handleDelete}
          />
        </StyledEditToolsContainer>
      )}
    </StyledCVExperience>
  );
}
