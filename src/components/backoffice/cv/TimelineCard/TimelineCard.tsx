import arrayMove from 'array-move';
import React from 'react';
import { CVExperience, CVFormation } from 'src/api/types';
import { Grid, ButtonIcon } from 'src/components/utils';
import { AnyCantFix } from 'src/utils/Types';
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
}

export const TimelineCard = ({
  experiences,
  onChange,
  title,
  onAdd,
  editProps,
}: TimeLineCardProps) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">{title}</h3>
        {onAdd && <ButtonIcon onClick={onAdd} name="plus" />}
      </Grid>
      <TimeLineList
        items={experiences}
        onChange={onChange}
        editProps={editProps}
      />
    </div>
  );
};
