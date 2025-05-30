import _ from 'lodash';
import moment from 'moment/moment';
import React from 'react';
import 'moment/locale/fr';

interface CVDateProps {
  experienceOrFormation: { startDate?: string; endDate?: string };
  isMobile?: boolean;
}

export const formatDate = (date?: string) => {
  return _.capitalize(moment(date).format('MMMM YYYY').replace(' ', '\xa0'));
};

export function CVDate({
  experienceOrFormation,
  isMobile = false,
}: CVDateProps) {
  const { startDate, endDate } = experienceOrFormation;
  if (isMobile) {
    return (
      <>
        {formatDate(startDate)}
        <br />
        {endDate ? formatDate(endDate) : "Aujourd'hui"}
      </>
    );
  }
  return (
    <>
      {endDate ? formatDate(endDate) : "Aujourd'hui"}
      <br />
      {formatDate(startDate)}
    </>
  );
}
