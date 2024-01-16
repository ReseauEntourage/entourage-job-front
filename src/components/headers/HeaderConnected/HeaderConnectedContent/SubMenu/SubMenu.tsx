import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  HeaderConnectedItem,
  NotifBadges,
} from 'src/components/headers/HeaderConnected/HeaderConnected.types';
import { SimpleLink } from 'src/components/utils';
import { Tag } from 'src/components/utils/Tag';
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
                <div>
                  &nbsp;
                  <Tag size="small" style="secondary" content={badges[badge]} />
                </div>
              )}
            </SimpleLink>
          );
        }
      )}
    </StyledSubMenu>
  );
};
