import React, { type JSX } from 'react';

export interface OpportunitiesContainerProps {
  isLoading: boolean;
  list: JSX.Element | null;
  details: React.ReactNode;
  noContent: React.ReactNode;
  backButtonHref?: {
    pathname: string;
    query: { [key: string]: string | string[] | undefined };
  };
}
