import React from 'react';
import { uuid } from 'uuid/v4';
import { PropTypes } from 'prop-types';
import { StyledSubMenu } from 'src/components/headers/SubMenu/styles';
import SimpleLink from 'src/components/utils/SimpleLink';
import { IconNoSSR } from 'src/components/utils/Icon';
import {
  HeaderSubItemShape,
  HeaderSubItemDefaultProps,
  NotifBadgesShape,
} from 'src/components/headers/Header.shape';
import { gaEvent } from 'src/lib/gtag';

const SubMenu = ({ items, badges }) => {
  return (
    <StyledSubMenu className="subMenu-container">
      {items.map(
        ({ href, badge, icon, name, tag, external, queryParams }, key) => {
          return (
            <SimpleLink
              href={href + (queryParams || '')}
              className="subMenu-item"
              key={`${key}-${uuid}`}
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
