import React from 'react';
import { uuid } from 'uuid/v4';
import { PropTypes } from 'prop-types';
import { StyledSubMenu } from './styles';
import SimpleLink from '../../utils/SimpleLink';
import { IconNoSSR } from '../../utils/Icon';
import {
  HeaderSubItemShape,
  HeaderSubItemDefaultProps,
  NotifBadgesShape,
} from '../Header.shape';

const SubMenu = ({ items, badges }) => {
  return (
    <StyledSubMenu className="subMenu-container">
      {items.map(({ href, badge, icon, name }, key) => {
        return (
          <SimpleLink
            href={href}
            className="subMenu-item"
            key={`${key}-${uuid}`}
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
      })}
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
