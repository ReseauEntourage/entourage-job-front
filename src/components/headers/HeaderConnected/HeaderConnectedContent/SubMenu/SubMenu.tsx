import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  HeaderConnectedItem,
  NotifBadges,
} from 'src/components/headers/HeaderConnected/HeaderConnected.types';
import { SimpleLink } from 'src/components/utils';
import { gaEvent } from 'src/lib/gtag';
import { StyledSubMenu } from './SubMenu.styles';

const uuidValue = uuid();

export const SubMenu = ({
  items,
  badges,
}: {
  items: HeaderConnectedItem[];
  badges: NotifBadges;
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
                {icon}
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
