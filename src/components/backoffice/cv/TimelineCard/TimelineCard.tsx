import React from 'react'
import arrayMove from 'array-move';
import { Grid, ButtonIcon } from 'src/components/utils';import { TimeLineList } from './TimeLineList';

export const TimelineCard = ({ 
    experiences, 
    onChange,
    title,
    onAdd,
    editProps,
     }) => {
          
    const updateExperiencesOrder = (reorderedExperiences) => {
      const newExperiencesList = [];
      for (let i = 0; i < reorderedExperiences.length; i += 1) {
        newExperiencesList.push({
          ...reorderedExperiences[i],
          order: i,
        });
      }
  
      onChange({
        experiences: [...newExperiencesList],
      });
    };
  
    const onSortEnd = ({ oldIndex, newIndex }) => {
      const reorderedExperiences = arrayMove(
        experiences,
        oldIndex,
        newIndex
      );
      updateExperiencesOrder(reorderedExperiences);
    };
  
    return (
      <div className="uk-card uk-card-default uk-card-body">
        <Grid gap="small" between eachWidths={['expand', 'auto']}>
          <h3 className="uk-card-title">
            {title}
          </h3>
          {onAdd && (
            <ButtonIcon
              onClick={onAdd}
              name="plus"
            />
          )}
        </Grid>
        <TimeLineList
          pressDelay={150}
          items={experiences}
          onSortEnd={onSortEnd}
          onChange={onChange}
          updateOrder={updateExperiencesOrder}
          editProps={editProps}
        />
      </div>
    );

}



// ExperiencesProfileCard.propTypes = {
//     experiences: PropTypes.arrayOf(
//       PropTypes.shape({
//         description: PropTypes.string,
//       })
//     ),
//     onChange: PropTypes.func,
//   };
  
// ExperiencesProfileCard.defaultProps = {
//     experiences: [],
//     onChange: null,
//   };
  