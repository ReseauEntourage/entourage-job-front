import React from 'react';
import { CVExperience, CVFormation } from 'src/api/types';
import { formEditExperience } from 'src/components/forms/schemas/formEditExperience';
import { formEditFormation } from 'src/components/forms/schemas/formEditFormation';
import { Grid, ButtonIcon } from 'src/components/utils';
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
}

export const TimelineCard = ({
  experiences,
  onChange,
  title,
  onAdd,
  editProps,
  remainingItems,
  type,
}: TimeLineCardProps) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">{title}</h3>
        {onAdd && remainingItems > 0 && (
          <ButtonIcon
            onClick={onAdd}
            name="plus"
            dataTestId={`button-cv-add-${type}`}
          />
        )}
      </Grid>
      <TimeLineList
        items={experiences}
        onChange={onChange}
        editProps={editProps}
        type={type}
      />
      {remainingItems === 0 && (
        <StyledFooterCount warning>
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
    </div>
  );
};
