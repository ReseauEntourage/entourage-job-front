import Link from 'next/link';
import React from 'react';
import {
  StyledBreadcrumb,
  StyledBreadcrumbItem,
  StyledBreadcrumbLabel,
  StyledBreadcrumbList,
  StyledBreadcrumbSeparator,
} from './Breadcrumb.styles';
import { BreadcrumbProps } from './Breadcrumb.types';

/**
 * Every level but the last one is a link. Long labels are truncated visually
 * only (CSS ellipsis): the full label stays in the link and in its `title`.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <StyledBreadcrumb aria-label="Fil d'Ariane">
      <StyledBreadcrumbList>
        {items.map(({ label, href }, index) => {
          const isLast = index === items.length - 1;
          return (
            <StyledBreadcrumbItem key={`${index}-${label}`} $isLast={isLast}>
              <StyledBreadcrumbLabel $isLast={isLast} title={label}>
                {!isLast && href ? (
                  <Link href={href}>{label}</Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined}>
                    {label}
                  </span>
                )}
              </StyledBreadcrumbLabel>
              {!isLast && (
                <StyledBreadcrumbSeparator aria-hidden="true">
                  &gt;
                </StyledBreadcrumbSeparator>
              )}
            </StyledBreadcrumbItem>
          );
        })}
      </StyledBreadcrumbList>
    </StyledBreadcrumb>
  );
}
