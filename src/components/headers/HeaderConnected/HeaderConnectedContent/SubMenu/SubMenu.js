import React from 'react';
import { v4 as uuid } from 'uuid';
import { PropTypes } from 'prop-types';
import { StyledSubMenu } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/SubMenu/SubMenu.styles';
import SimpleLink from 'src/components/utils/SimpleLink';
import { IconNoSSR } from 'src/components/utils/Icon';
import {
  HeaderSubItemDefaultProps,
  HeaderSubItemShape,
  NotifBadgesShape,
} from 'src/components/headers/HeaderConnected/HeaderConnected.shapes';
import { gaEvent } from 'src/lib/gtag';

const uuidValue = uuid();

const SubMenu = ({ items, badges }) => {
  return (
    <StyledSubMenu className="subMenu-container">
      {items.map(
        ({ href, badge, icon, name, tag, external, queryParams }, key) => {
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

SubMenu.propTypes = {
  items: PropTypes.arrayOf(HeaderSubItemShape),
  badges: NotifBadgesShape,
};

SubMenu.defaultProps = {
  items: HeaderSubItemDefaultProps,
  badges: {},
};

export default SubMenu;
