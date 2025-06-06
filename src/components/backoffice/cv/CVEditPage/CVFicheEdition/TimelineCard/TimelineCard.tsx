import React from 'react';
import { CVExperience, CVFormation } from 'src/api/types';
import { formEditExperience } from 'src/components/forms/schemas/formEditExperience';
import { formEditFormation } from 'src/components/forms/schemas/formEditFormation';
import { Card } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { StyledFooterCount } from './TimeLineCard.styles';
import { TimeLineList } from './TimeLineList';

type CVData = {
  formations: CVFormation[];
  experiences: CVExperience[];
};

type CVDataUpdate = {
  [type in 'formations' | 'experiences']: CVData[type];
};
interface TimeLineCardProps {
  experiences: CVExperience[] | CVFormation[];
  onChange: (updatedCV: CVDataUpdate) => void;
  title: React.ReactNode;
  onAdd: () => void;
  editProps: {
    title: string;
    formSchema: typeof formEditExperience | typeof formEditFormation;
  };
  type: keyof CVData;
  remainingItems: number;
  dataTestId?: string;
}

export const TimelineCard = ({
  experiences,
  onChange,
  title,
  onAdd,
  editProps,
  remainingItems,
  type,
  dataTestId,
}: TimeLineCardProps) => {
  return (
    <Card
      title={title}
      editCallback={remainingItems ? onAdd : undefined}
      dataTestId={dataTestId}
      editIcon={<LucidIcon name="Plus" />}
    >
      <TimeLineList
        items={experiences}
        onChange={onChange}
        editProps={editProps}
        type={type}
      />
      {remainingItems < 0 && (
        <StyledFooterCount warning>
          Limite de {type} dépassée de {Math.abs(remainingItems)} élément(s)
        </StyledFooterCount>
      )}
      {remainingItems === 0 && (
        <StyledFooterCount>
          Vous avez atteint le maximum des {type} à entrer
        </StyledFooterCount>
      )}
      {remainingItems === 1 && (
        <StyledFooterCount>
          Vous pouvez encore entrer {remainingItems} {type.replace('s', '')}
        </StyledFooterCount>
      )}
      {remainingItems > 1 && (
        <StyledFooterCount>
          Vous pouvez encore entrer {remainingItems} {type}
        </StyledFooterCount>
      )}
    </Card>
  );
};
