import React from 'react';
import { Grid } from 'src/components/utils/Grid';

interface CardProps {
  children: React.ReactNode;
  badge?: React.ReactNode;
  style?: 'default' | 'primary' | 'secondary';
  title?: React.ReactNode;
  body?: boolean;
  hover?: boolean;
  size?: 'small' | 'large' | 'default';
}

// todo create a card component with each class parameters
export const Card = ({
  title,
  style,
  body,
  hover,
  size,
  children,
  badge,
}: CardProps) => {
  let classBuffer = 'uk-card';
  if (style) classBuffer += ` uk-card-${style}`;
  if (body) classBuffer += ` uk-card-body`;
  if (hover) classBuffer += ` uk-card-hover`;
  if (size) classBuffer += ` uk-card-${size}`;

  return (
    <div className={classBuffer}>
      {title && (
        <Grid gap="small" between eachWidths={['expand', 'auto']}>
          <h3 className="uk-card-title">{title}</h3>
          {badge}
        </Grid>
      )}
      {children}
    </div>
  );
};

Card.defaultProps = {
  style: 'default',
  title: null,
  body: true,
  hover: false,
  size: null,
  badge: null,
};
