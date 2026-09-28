import _ from 'lodash';
import moment from 'moment/moment';
import React from 'react';
import 'moment/locale/fr';

interface ExperienceOrFormationDates {
  startDate?: string;
  endDate?: string;
}

interface CVDateProps {
  experienceOrFormation: ExperienceOrFormationDates;
  isMobile?: boolean;
}

export const formatDate = (date?: string) => {
  return _.capitalize(moment(date).format('MMMM YYYY').replace(' ', '\xa0'));
};

export const formatYear = (date?: string) => {
  return moment(date).format('YYYY');
};

export const hasKnownDate = ({
  startDate,
  endDate,
}: ExperienceOrFormationDates) => {
  return !!startDate || !!endDate;
};

/**
 * Libellé des dates d'une expérience ou d'une formation sur une ligne :
 * - début et fin : "{début}{séparateur}{fin}"
 * - début seul (en cours) : "{début}{séparateur}Aujourd'hui"
 * - fin seule : l'année de fin
 * - aucune date : null
 */
export const formatDateRange = (
  { startDate, endDate }: ExperienceOrFormationDates,
  separator = ' - '
) => {
  if (!startDate) {
    return endDate ? formatYear(endDate) : null;
  }
  const end = endDate ? formatDate(endDate) : "Aujourd'hui";
  return `${formatDate(startDate)}${separator}${end}`;
};

export function CVDate({
  experienceOrFormation,
  isMobile = false,
}: CVDateProps) {
  const { startDate, endDate } = experienceOrFormation;
  if (!startDate) {
    return endDate ? <>{formatYear(endDate)}</> : null;
  }
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
