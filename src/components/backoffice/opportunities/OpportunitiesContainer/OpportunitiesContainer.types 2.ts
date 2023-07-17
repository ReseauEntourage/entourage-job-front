import React from 'react';

export interface OpportunitiesContainerProps {
  isLoading: boolean;
  list: JSX.Element;
  details: React.ReactNode;
  noContent: React.ReactNode;
  backButtonHref?: {
    pathname: string;
    query: { [p: string]: string | string[] };
  };
}
