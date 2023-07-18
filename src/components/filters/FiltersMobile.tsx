import React, { useEffect, useState } from 'react';
import UIkit from 'uikit';

import { Button, Icon } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const FiltersMobile = ({
  numberOfFilters,
}: {
  numberOfFilters?: number;
}) => {
  const [filterMenuOpened, setFilterMenuOpened] = useState(false);

  const onFilterMenuToggle = (opened) => {
    if (opened) gaEvent(GA_TAGS.PAGE_GALERIE_AFFICHER_FILTRES_CLIC);
    setFilterMenuOpened(opened);
  };

  useEffect(() => {
    const modalInterval = setInterval(() => {
      if (UIkit) {
        clearInterval(modalInterval);
        UIkit.util.on(document, 'show', '#toggle-filter-menu', () => {
          return onFilterMenuToggle(true);
        });
        UIkit.util.on(document, 'hide', '#toggle-filter-menu', () => {
          return onFilterMenuToggle(false);
        });
      }
    }, 1000);

    return () => {
      clearInterval(modalInterval);
    };
  }, []);

  return (
    <div className="uk-flex uk-flex-middle uk-flex-center uk-hidden@m">
      <Button
        style=""
        className="ent-filter-button-search"
        toggle="target: #toggle-filter-menu;"
      >
        <div className="uk-position-relative">
          <Icon
            style={{ width: 18, height: 18 }}
            name={`filter${filterMenuOpened ? '' : '-empty'}`}
          />
          {numberOfFilters > 0 && (
            <div className="ent-filter-badge-search uk-text-nowrap">
              {numberOfFilters}
            </div>
          )}
        </div>
      </Button>
    </div>
  );
};

FiltersMobile.defaultProps = {
  numberOfFilters: 0,
};
