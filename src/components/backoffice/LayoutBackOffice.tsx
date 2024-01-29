import React from 'react';
import { Layout } from 'src/components/Layout';

export const LayoutBackOffice = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <Layout title={`${title} - LinkedOut`} noIndex isBackoffice>
      {children}
    </Layout>
  );
};

LayoutBackOffice.defaultProps = {
  title: 'Espace perso',
};
