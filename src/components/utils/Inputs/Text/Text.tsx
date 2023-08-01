import React from 'react';

interface TextProps {
  id: string;
  title: string;
}
export function Text({ id, title }: TextProps) {
  return (
    <p id={id} data-testid={id}>
      {title}
    </p>
  );
}
