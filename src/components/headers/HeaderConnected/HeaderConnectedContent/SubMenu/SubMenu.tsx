import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  HeaderConnectedItemProps,
  NotifBadgesProps,
} from '../../HeaderConnected.types';
import { StyledSubMenu } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/SubMenu/SubMenu.styles';
import { SimpleLink, IconNoSSR } from 'src/components/utils';
import { gaEvent } from 'src/lib/gtag';

const uuidValue = uuid();

export const SubMenu = ({
  items,
  badges,
}: {
  items: HeaderConnectedItemProps[];
  badges: NotifBadgesProps;
}) => {
  return (
    <StyledSubMenu className="subMenu-container">
      {items.map(
        (
          {
            href,
            name,
            tag,
            badge = '',
            icon = '',
            external = false,
            queryParams = '',
            disabled = false,
          },
          key
        ) => {
          return (
            <SimpleLink
              href={href + (queryParams || '')}
              className="subMenu-item"
              key={`${key}-${uuidValue}`}
              onClick={() => {
                if (tag) gaEvent(tag);
              }}
              target={external ? '_blank' : '_self'}
            >
              <span>
                <IconNoSSR name={icon} />
                {name}
              </span>
              {badges[badge] > 0 && (
                <div className="uk-badge uk-margin-small-left">
                  {badges[badge]}
                </div>
              )}
            </SimpleLink>
          );
        }
      )}
    </StyledSubMenu>
  );
};
