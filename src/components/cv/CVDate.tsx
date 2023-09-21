import moment from 'moment/moment';
import React from 'react';
import 'moment/locale/fr';
import _ from 'lodash';

interface CVDateProps {
  experience: { dateStart?: Date; dateEnd?: Date };
  isMobile?: boolean;
}

export function CVDate({ experience, isMobile = false }: CVDateProps) {
  const { dateStart, dateEnd } = experience;
  if (isMobile) {
    return (
      <>
        {_.capitalize(
          moment(dateStart).format('MMMM YYYY').replace(' ', '\xa0')
        )}
        &nbsp;-
        {dateEnd
          ? _.capitalize(
              moment(dateEnd).format('MMMM YYYY').replace(' ', '\xa0')
            )
          : "Aujourd'hui"}
      </>
    );
  }
  return (
    <>
      {dateEnd
        ? _.capitalize(moment(dateEnd).format('MMMM YYYY')).replace(' ', '\xa0')
        : "Aujourd'hui"}
      &nbsp;-
      <br />
      {_.capitalize(moment(dateStart).format('MMMM YYYY')).replace(' ', '\xa0')}
    </>
  );
}
