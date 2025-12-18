import React from 'react';

type SiteMapItem = {
  component?: React.ReactNode;
  title?: string;
  path?: string;
  props?: {
    isExternal?: boolean;
    newTab?: boolean;
    onClick?: () => void;
    target?: string;
  };
  children?: SiteMapItem[];
};

export type PageType = {
  title?: string;
  children?: SiteMapItem[];
}[];
