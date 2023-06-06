import React from 'react';
import Layout from 'src/components/Layout';

const LayoutBackOffice = ({
  children,
  title,
  isEmpty,
}: {
  children: React.ReactNode;
  title?: string;
  isEmpty?: boolean;
}) => {
  return (
    <Layout
      title={`${title} - LinkedOut`}
      noIndex
      isBackoffice
      isEmpty={isEmpty}
    >
      {children}
    </Layout>
  );
};

LayoutBackOffice.defaultProps = {
  title: 'Espace perso',
  isEmpty: false,
};
export default LayoutBackOffice;
