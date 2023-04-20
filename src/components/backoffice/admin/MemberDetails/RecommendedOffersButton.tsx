import _ from 'lodash';
import React from 'react';
import { Button, Icon } from 'src/components/utils';
import { OFFER_ADMIN_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { useFetchCV } from 'src/hooks/useFetchCV';
import { gaEvent } from 'src/lib/gtag';

interface RecommendedOffersButtonProps {
  candidateId: string;
}

export function RecommendedOffersButton({
  candidateId,
}: RecommendedOffersButtonProps) {
  const { cv, error, loading } = useFetchCV(candidateId);

  if (loading || error || !cv) {
    return null;
  }

  return (
    <Button
      style="default"
      href={{
        pathname: '/backoffice/admin/offres',
        query: {
          tag: OFFER_ADMIN_FILTERS_DATA[1].tag,
          department: cv.locations.map(({ name }) => {
            return name;
          }),
          businessLines: _.uniq(
            cv.businessLines.map(({ name }) => {
              return name;
            })
          ),
        },
      }}
      onClick={() => {
        gaEvent(GA_TAGS.BACKOFFICE_ADMIN_OFFRES_INTERESSER_CLIC);
      }}
    >
      Voir les offres qui pourraient intéresser le candidat
      <Icon name="chevron-right" ratio="0.8" className="uk-margin-small-left" />
    </Button>
  );
}
