import React from 'react';
import { CVExperience, CVFormation } from 'src/api/types';
import { Grid, ButtonIcon } from 'src/components/utils';
import { AnyCantFix } from 'src/utils/Types';
import { StyledFooterCount } from './TimeLineCard.styles';
import { TimeLineList } from './TimeLineList';

interface TimeLineCardProps {
  experiences: CVExperience[] | CVFormation[];
  onChange: (arg1: any) => void;
  title: React.ReactNode;
  onAdd: () => void;
  editProps: {
    title: string;
    formSchema: AnyCantFix;
  };
  type: string;
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
          <ButtonIcon onClick={onAdd} name="plus" />
        )}
      </Grid>
      <TimeLineList
        items={experiences}
        onChange={onChange}
        editProps={editProps}
        type={type}
      />
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
    </div>
  );
};
