export type ChildrenType = {
  component?: React.ReactNode;
  title?: string;
  path?: string;
  props?: {
    isExternal?: boolean;
    newTab?: boolean;
    onClick?: () => void;
    target?: string;
  };
  children?: {
    component?: React.ReactNode;
    title?: string;
    path?: string;
    children?: {
      component?: React.ReactNode;
      title?: string;
      path?: string;
      props?: {
        isExternal?: boolean;
        newTab?: boolean;
        onClick?: () => void;
        target?: string;
      };
    }[];
    props?: {
      isExternal?: boolean;
      newTab?: boolean;
      onClick?: () => void;
      target?: string;
    };
  }[];
};

export type PageType = {
  title?: string;
  children?: ChildrenType[];
};
